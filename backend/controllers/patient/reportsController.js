const Report = require('../../models/doctor/Report');
const PatientRecord = require('../../models/doctor/PatientRecord');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');

// Get all reports for the current patient
const getPatientReports = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    
    // First, find the patient record to get the patient ObjectId
    const patientRecord = await PatientRecord.findOne({ email: patientEmail });
    
    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'No patient record found for this user'
      });
    }

    // Find all reports for this patient
    const reports = await Report.find({ patient: patientRecord._id })
      .populate('doctor', 'name email')
      .populate('patient', 'name email')
      .sort({ date: -1 }); // Sort by date, newest first

    // Format reports for frontend
    const formattedReports = reports.map(report => ({
      _id: report._id,
      type: report.type,
      date: report.date,
      status: report.status,
      pdfPath: report.pdfPath,
      doctor: {
        name: report.doctor?.name || 'Unknown Doctor',
        email: report.doctor?.email || ''
      },
      patient: {
        name: report.patient?.name || patientRecord.name,
        email: report.patient?.email || patientRecord.email
      },
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: formattedReports,
      count: formattedReports.length
    });
  } catch (error) {
    console.error('Error fetching patient reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

// Get a specific report by ID
const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const patientEmail = req.user.email;
    
    // Find the patient record to verify ownership
    const patientRecord = await PatientRecord.findOne({ email: patientEmail });
    
    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'No patient record found for this user'
      });
    }

    // Find the specific report and verify it belongs to this patient
    const report = await Report.findOne({ 
      _id: reportId, 
      patient: patientRecord._id 
    })
      .populate('doctor', 'name email')
      .populate('patient', 'name email');

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
      doctor: {
        name: report.doctor?.name || 'Unknown Doctor',
        email: report.doctor?.email || ''
      },
      patient: {
        name: report.patient?.name || patientRecord.name,
        email: report.patient?.email || patientRecord.email
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
    const patientEmail = req.user.email;
    
    // Find the patient record to verify ownership
    const patientRecord = await PatientRecord.findOne({ email: patientEmail });
    
    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'No patient record found for this user'
      });
    }

    // Find the specific report and verify it belongs to this patient
    const report = await Report.findOne({ 
      _id: reportId, 
      patient: patientRecord._id 
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

    // Set appropriate headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.type}_${report.date.toISOString().split('T')[0]}.pdf"`);
    
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

// Get report statistics for dashboard
const getReportStats = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    
    // Find the patient record
    const patientRecord = await PatientRecord.findOne({ email: patientEmail });
    
    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'No patient record found for this user'
      });
    }

    // Get report statistics
    const totalReports = await Report.countDocuments({ patient: patientRecord._id });
    const pendingReports = await Report.countDocuments({ 
      patient: patientRecord._id, 
      status: 'pending' 
    });
    const completedReports = await Report.countDocuments({ 
      patient: patientRecord._id, 
      status: 'completed' 
    });
    const reviewedReports = await Report.countDocuments({ 
      patient: patientRecord._id, 
      status: 'reviewed' 
    });

    // Get latest report
    const latestReport = await Report.findOne({ patient: patientRecord._id })
      .populate('doctor', 'name')
      .sort({ date: -1 });

    // Get report types breakdown
    const reportTypes = await Report.aggregate([
      { $match: { patient: patientRecord._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      total: totalReports,
      pending: pendingReports,
      completed: completedReports,
      reviewed: reviewedReports,
      latest: latestReport ? {
        type: latestReport.type,
        date: latestReport.date,
        status: latestReport.status,
        doctor: latestReport.doctor?.name || 'Unknown Doctor'
      } : null,
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
  getPatientReports,
  getReportById,
  downloadReport,
  getReportStats
};
