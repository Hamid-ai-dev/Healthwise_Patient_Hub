const express = require('express');
const router = express.Router();
const { createDoctorProfile } = require('../controllers/doctorController');

router.post('/submitDoctorVerification', createDoctorProfile);

module.exports = router;
