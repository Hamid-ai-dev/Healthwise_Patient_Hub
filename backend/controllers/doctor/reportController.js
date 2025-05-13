const Report = require('../../models/doctor/Report');
const PatientRecord = require('../../models/doctor/PatientRecord');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// --- Helper Function to get Absolute PDF Path ---
const getAbsolutePdfPath = (relativePath) => {
  // relativePath is stored like '/uploads/report_123.pdf'
  const filename = path.basename(relativePath); // Extracts 'report_123.pdf'
  // __dirname in this controller is .../backend/controllers/doctor
  // Go up two levels to 'backend', then join with 'uploads' and filename.
  const absolutePath = path.join(__dirname, '..', '..', 'uploads', filename);
  // console.log(`[getAbsolutePdfPath] Resolved path: ${absolutePath}`); // For debugging
  return absolutePath;
};

// --- Get Reports (Handles All for Doctor OR Specific Patient for Doctor) ---
exports.getAllReports = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId, search } = req.query;

    let queryFilter = { doctor: doctorId };

    if (patientId) {
       if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: 'Invalid patient ID format' });
        }
      queryFilter.patient = patientId;
    }

    let reportQuery = Report.find(queryFilter)
                            .populate('patient', 'name')
                            .sort({ date: -1 });

    let reports = await reportQuery.exec();

    if (search) {
        const searchTermLower = search.toLowerCase();
        reports = reports.filter(report =>
            (report.type && report.type.toLowerCase().includes(searchTermLower)) ||
            (report.patient && report.patient.name && report.patient.name.toLowerCase().includes(searchTermLower))
        );
    }

    const formattedReports = reports.map(report => ({
      id: report._id,
      patientId: report.patient?._id,
      patientName: report.patient?.name || "Unknown Patient",
      type: report.type,
      date: report.date,
      status: report.status,
    }));

    res.status(200).json(formattedReports);

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

// --- Get Single Report by ID ---
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid report ID format' });
      }

    const report = await Report.findOne({ _id: id, doctor: doctorId })
                               .populate('patient', 'name email phone');

    if (!report) {
      return res.status(404).json({ message: 'Report not found or access denied' });
    }

    const formattedReport = {
        id: report._id,
        patientId: report.patient?._id,
        patientName: report.patient?.name,
        patientEmail: report.patient?.email,
        patientPhone: report.patient?.phone,
        doctor: report.doctor,
        type: report.type,
        date: report.date,
        status: report.status,
        pdfPath: report.pdfPath,
    };

    res.status(200).json(formattedReport);

  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report details' });
  }
};

// --- Create a New Report ---
exports.createReport = async (req, res) => {
  const { patientId, type, date, results, recommendations, notes } = req.body;
  const doctorId = req.user._id;

  if (!patientId || !type || !date || !results) {
    return res.status(400).json({ message: 'Missing required fields: patientId, type, date, results' });
  }

   if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID format' });
    }

  try {
    const patient = await PatientRecord.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // This path calculation should be correct now based on controller location
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const pdfFileName = `report_${patientId}_${Date.now()}.pdf`;
    const pdfRelativePath = `/uploads/${pdfFileName}`; // Path stored in DB
    const pdfAbsolutePath = path.join(uploadDir, pdfFileName); // Actual file system path
    const doc = new PDFDocument({ margin: 50 });

    const writeStream = fs.createWriteStream(pdfAbsolutePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text('Medical Report', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12);
    doc.text(`Patient Name: ${patient.name}`, { continued: true });
    doc.text(`Date: ${new Date(date).toLocaleDateString()}`, { align: 'right' });
    doc.text(`Report Type: ${type}`);
    doc.text(`Doctor: ${req.user.name}`);
    doc.moveDown();
    doc.fontSize(14).text('Results:', { underline: true });
    doc.fontSize(12).text(results || 'N/A');
    doc.moveDown();
    if (recommendations) {
      doc.fontSize(14).text('Recommendations:', { underline: true });
      doc.fontSize(12).text(recommendations);
      doc.moveDown();
    }
    if (notes) {
      doc.fontSize(14).text('Additional Notes:', { underline: true });
      doc.fontSize(12).text(notes);
    }
    doc.end();

    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });

    const newReport = new Report({
      patient: patientId,
      doctor: doctorId,
      type,
      date,
      status: 'completed',
      pdfPath: pdfRelativePath
    });

    await newReport.save();
    const createdReport = await Report.findById(newReport._id).populate('patient', 'name');

    res.status(201).json({
        message: 'Report created successfully',
        report: {
            id: createdReport._id,
            patientId: createdReport.patient?._id,
            patientName: createdReport.patient?.name || "Unknown Patient",
            type: createdReport.type,
            date: createdReport.date,
            status: createdReport.status,
        }
     });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error creating report' });
  }
};

// --- Download Report PDF ---
exports.downloadReport = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user._id;

         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid report ID format' });
         }

        const report = await Report.findOne({ _id: id, doctor: doctorId }).populate('patient', 'name');

        if (!report) {
            return res.status(404).json({ message: 'Report not found or access denied' });
        }
        if (!report.pdfPath) {
            return res.status(404).json({ message: 'No PDF file associated with this report' });
        }

        // Use the corrected helper function
        const absolutePath = getAbsolutePdfPath(report.pdfPath);

        if (!fs.existsSync(absolutePath)) {
            console.error(`Download Error: PDF file not found at path: ${absolutePath} (referenced by report ${id})`);
            return res.status(404).json({ message: 'PDF file not found on server' });
        }

        const patientName = report.patient?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'patient';
        const reportDate = new Date(report.date).toISOString().split('T')[0];
        const filename = `Medical_Report_${patientName}_${reportDate}.pdf`;

        res.download(absolutePath, filename, (err) => {
            if (err) {
                console.error("Error sending file for download:", err);
                if (!res.headersSent) {
                    res.status(500).send({ message: "Could not download the file." });
                }
            }
        });

    } catch (error) {
        console.error('Error downloading report:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading report' });
        }
    }
};

// --- View Report PDF in Browser ---
exports.viewReport = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user._id;

         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid report ID format' });
         }

        const report = await Report.findOne({ _id: id, doctor: doctorId });

        if (!report) {
            return res.status(404).json({ message: 'Report not found or access denied' });
        }
        if (!report.pdfPath) {
            return res.status(404).json({ message: 'No PDF file associated with this report' });
        }

        // Use the corrected helper function
        const absolutePath = getAbsolutePdfPath(report.pdfPath);

        if (!fs.existsSync(absolutePath)) {
            console.error(`View Error: PDF file not found at path: ${absolutePath} (referenced by report ${id})`);
            return res.status(404).json({ message: 'PDF file not found on server' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="report.pdf"');

        res.sendFile(absolutePath, (err) => {
             if (err) {
                console.error("Error sending file for viewing:", err);
                if (!res.headersSent) {
                     res.status(500).send({ message: "Could not view the file." });
                }
            }
        });

    } catch (error) {
        console.error('Error viewing report:', error);
         if (!res.headersSent) {
           res.status(500).json({ message: 'Error viewing report' });
         }
    }
};