const express = require('express');
const router = express.Router();
const { protect, requireDoctorRole } = require('../../middleware/authMiddleware');
const reportController = require('../../controllers/doctor/reportController');

// --- Report Routes ---

// GET /api/doctor/reports - Get all reports for the logged-in doctor (optionally filtered by patientId query param)
router.get('/', protect, requireDoctorRole, reportController.getAllReports);

// POST /api/doctor/reports - Create a new report
router.post('/', protect, requireDoctorRole, reportController.createReport);

// GET /api/doctor/reports/:id - Get a specific report by ID
router.get('/:id', protect, requireDoctorRole, reportController.getReportById);

// GET /api/doctor/reports/:id/download - Download the PDF for a specific report
router.get('/:id/download', protect, requireDoctorRole, reportController.downloadReport);

// GET /api/doctor/reports/:id/view - View the PDF for a specific report in the browser
router.get('/:id/view', protect, requireDoctorRole, reportController.viewReport);

// Potential future routes:
// PUT /api/doctor/reports/:id - Update a report
// DELETE /api/doctor/reports/:id - Delete a report

module.exports = router;