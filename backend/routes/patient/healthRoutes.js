const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const {
  getHealthOverview,
  getHealthMetrics,
  getHealthStats
} = require('../../controllers/patient/healthController');

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

// GET /api/patient/health/overview - Get patient health overview
router.get('/overview', getHealthOverview);

// GET /api/patient/health/metrics - Get detailed health metrics with history
router.get('/metrics', getHealthMetrics);

// GET /api/patient/health/stats - Get health statistics for dashboard
router.get('/stats', getHealthStats);

module.exports = router;
