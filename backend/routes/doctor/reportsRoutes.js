const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const {
  getDoctorReports,
  getReportById,
  downloadReport,
  viewReport,
  getReportsStats
} = require('../../controllers/doctor/reportsController');

// Apply authentication middleware to all routes
router.use(protect);

// Middleware to ensure only doctors can access these routes
const ensureDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Doctor role required.'
    });
  }
  next();
};

router.use(ensureDoctor);

// GET /api/doctor/reports - Get all reports for the current doctor with search and filters
// Query parameters:
// - search: Search in report type, patient name, or patient email
// - patientId: Filter by specific patient
// - status: Filter by report status (pending, completed, reviewed)
// - type: Filter by report type
// - page: Page number for pagination (default: 1)
// - limit: Number of reports per page (default: 10)
router.get('/', getDoctorReports);

// GET /api/doctor/reports/stats - Get report statistics for dashboard
router.get('/stats', getReportsStats);

// GET /api/doctor/reports/:reportId - Get a specific report by ID
router.get('/:reportId', getReportById);

// GET /api/doctor/reports/:reportId/download - Download a report PDF
router.get('/:reportId/download', downloadReport);

// GET /api/doctor/reports/:reportId/view - View a report PDF in browser
router.get('/:reportId/view', viewReport);

module.exports = router;
