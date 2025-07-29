const Report = require('../../models/doctor/Report');
const PatientRecord = require('../../models/doctor/PatientRecord');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');

// Get all reports for the current doctor
const getDoctorReports = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { search, patientId, status, type, page = 1, limit = 10 } = req.query;
    
    // Build query for reports by this doctor
    let query = { doctor: doctorId };
    
    // Add filters
    if (patientId) {
      query.patient = patientId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get reports with populated patient and doctor data
    let reportsQuery = Report.find(query)
      .populate('patient', 'name email phone age gender')
      .populate('doctor', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const reports = await reportsQuery;
    
    // Apply search filter after population (for patient name search)
    let filteredReports = reports;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReports = reports.filter(report => 
        report.type.toLowerCase().includes(searchLower) ||
        (report.patient && report.patient.name.toLowerCase().includes(searchLower)) ||
        (report.patient && report.patient.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Get total count for pagination
    const totalReports = await Report.countDocuments(query);
    
    // Format reports for frontend
    const formattedReports = filteredReports.map(report => ({
      _id: report._id,
      type: report.type,
      date: report.date,
      status: report.status,
      pdfPath: report.pdfPath,
      patient: {
        _id: report.patient._id,
        name: report.patient.name,
        email: report.patient.email,
        phone: report.patient.phone,
        age: report.patient.age,
        gender: report.patient.gender
      },
      doctor: {
        _id: report.doctor._id,
        name: report.doctor.name,
        email: report.doctor.email
      },
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));
    
    res.status(200).json({
      success: true,
      data: formattedReports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReports / parseInt(limit)),
        totalReports: totalReports,
        hasNext: skip + filteredReports.length < totalReports,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctor reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

// Get a specific report by ID (only if it belongs to the doctor)
const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const doctorId = req.user._id;
    
    // Find the report and verify it belongs to this doctor
    const report = await Report.findOne({ 
      _id: reportId, 
      doctor: doctorId 
    })
      .populate('patient', 'name email phone age gender address')
      .populate('doctor', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied'
      });
    }

    // Format report for frontend
    const formattedReport = {
      _id: report._id,
      type: report.type,
      date: report.date,
      status: report.status,
      pdfPath: report.pdfPath,
      patient: {
        _id: report.patient._id,
        name: report.patient.name,
        email: report.patient.email,
        phone: report.patient.phone,
        age: report.patient.age,
        gender: report.patient.gender,
        address: report.patient.address
      },
      doctor: {
        _id: report.doctor._id,
        name: report.doctor.name,
        email: report.doctor.email
      },
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    };

    res.status(200).json({
      success: true,
      data: formattedReport
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};

// Download a report PDF
const downloadReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const doctorId = req.user._id;
    
    // Find the report and verify it belongs to this doctor
    const report = await Report.findOne({ 
      _id: reportId, 
      doctor: doctorId 
    }).populate('patient', 'name');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied'
      });
    }

    // Construct the full file path
    const filePath = path.join(__dirname, '../../', report.pdfPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found on server'
      });
    }

    // Set appropriate headers for PDF download
    const fileName = `${report.patient.name}_${report.type}_${report.date.toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading report',
      error: error.message
    });
  }
};

// View report PDF in browser
const viewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const doctorId = req.user._id;
    
    // Find the report and verify it belongs to this doctor
    const report = await Report.findOne({ 
      _id: reportId, 
      doctor: doctorId 
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied'
      });
    }

    // Construct the full file path
    const filePath = path.join(__dirname, '../../', report.pdfPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found on server'
      });
    }

    // Set appropriate headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error viewing report:', error);
    res.status(500).json({
      success: false,
      message: 'Error viewing report',
      error: error.message
    });
  }
};

// Get reports statistics for dashboard
const getReportsStats = async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    // Get report statistics
    const totalReports = await Report.countDocuments({ doctor: doctorId });
    const pendingReports = await Report.countDocuments({ 
      doctor: doctorId, 
      status: 'pending' 
    });
    const completedReports = await Report.countDocuments({ 
      doctor: doctorId, 
      status: 'completed' 
    });
    const reviewedReports = await Report.countDocuments({ 
      doctor: doctorId, 
      status: 'reviewed' 
    });

    // Get latest reports
    const latestReports = await Report.find({ doctor: doctorId })
      .populate('patient', 'name')
      .sort({ date: -1 })
      .limit(5);

    // Get report types breakdown
    const reportTypes = await Report.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      total: totalReports,
      pending: pendingReports,
      completed: completedReports,
      reviewed: reviewedReports,
      latest: latestReports.map(report => ({
        _id: report._id,
        type: report.type,
        date: report.date,
        status: report.status,
        patientName: report.patient?.name || 'Unknown Patient'
      })),
      typeBreakdown: reportTypes
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching report statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDoctorReports,
  getReportById,
  downloadReport,
  viewReport,
  getReportsStats
};
