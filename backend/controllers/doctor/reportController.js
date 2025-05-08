/**
 * Report controller for doctor routes
 */

const Report = require('../../models/doctor/Report');
const PatientRecord = require('../../models/doctor/PatientRecord');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    // Implementation will be added here
    res.status(200).json({ message: 'Get all reports endpoint' });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    // Implementation will be added here
    res.status(200).json({ message: `Get report with ID: ${id}` });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report details' });
  }
};

// Create a new report
exports.createReport = async (req, res) => {
  const { patientId, type, date, results, recommendations, notes } = req.body;

  if (!patientId || !type || !date || !results) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const patient = await PatientRecord.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const pdfFileName = `report_${Date.now()}.pdf`;
    const pdfPath = path.join(uploadDir, pdfFileName);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(16).text('Medical Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Results:', { underline: true });
    doc.text(results);
    doc.moveDown();

    if (recommendations) {
      doc.text('Recommendations:', { underline: true });
      doc.text(recommendations);
      doc.moveDown();
    }

    if (notes) {
      doc.text('Additional Notes:', { underline: true });
      doc.text(notes);
    }

    doc.end();

    const report = new Report({
      patient: patientId,
      doctor: req.user._id,
      type,
      date,
      status: 'pending',
      pdfPath: `/uploads/${pdfFileName}`
    });

    await report.save();
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error creating report' });
  }
};