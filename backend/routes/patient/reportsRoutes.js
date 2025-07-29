const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const {
  getPatientReports,
  getReportById,
  downloadReport,
  getReportStats
} = require('../../controllers/patient/reportsController');

// Apply authentication middleware to all routes
router.use(protect);

// Middleware to ensure only patients can access these routes
const ensurePatient = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Patient role required.'
    });
  }
  next();
};

router.use(ensurePatient);

// GET /api/patient/reports - Get all reports for the current patient
router.get('/', getPatientReports);

// GET /api/patient/reports/stats - Get report statistics for dashboard
router.get('/stats', getReportStats);

// GET /api/patient/reports/:reportId - Get a specific report by ID
router.get('/:reportId', getReportById);

// GET /api/patient/reports/:reportId/download - Download a report PDF
router.get('/:reportId/download', downloadReport);

module.exports = router;
