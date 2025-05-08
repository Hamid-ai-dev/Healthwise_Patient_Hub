const express = require('express');
const router = express.Router();
const { protect, requireDoctorRole } = require('../../middleware/authMiddleware');
// Fix the path to point to the controllers directory instead of controller
const reportController = require('../../controllers/doctor/reportController');

// Define routes using the controller
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.post('/', protect, requireDoctorRole, reportController.createReport);
// Add more routes as needed

module.exports = router;