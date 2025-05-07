const express = require('express');
const router = express.Router();
const { saveDoctorProfile } = require('../../controllers/doctor/profileController');
const { protect, requireDoctorRole } = require('../../middleware/authMiddleware');

// POST /api/doctor/profile - Save or update doctor profile information
router.post('/', protect, requireDoctorRole, saveDoctorProfile);

module.exports = router;