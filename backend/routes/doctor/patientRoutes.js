const express = require('express');
const router = express.Router();
const { addDoctorsPatient } = require('../../controllers/doctor/patientController');
const { protect, requireDoctorRole } = require('../../middleware/authMiddleware');


const upload = require('../../middleware/multerConfig');

const patientController = require('../../controllers/doctor/patientController');

router.get('/', protect, requireDoctorRole, patientController.getPatients);


// Route to add a new patient
router.post('/add-patient', protect, requireDoctorRole, upload.single('image'), addDoctorsPatient);

module.exports = router;