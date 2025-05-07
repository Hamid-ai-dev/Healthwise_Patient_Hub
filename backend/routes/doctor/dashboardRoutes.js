const express = require('express');
const { protect, requireDoctorRole } = require('../../middleware/authMiddleware'); // Adjust path as needed
const {
    getTodaysAppointmentsCount,
    getTotalPatientsCount,
    getCompletionRate,
    getNewMessagesCount,
    getAppointmentStats,
    getPatientStats,
    getPendingTasks,
} = require('../../controllers/doctor/dashboardController'); // Fixed path to use 'controllers' (plural)

const router = express.Router();

// --- Apply Authentication and Role Middleware ---
// These middleware will run for ALL routes defined below in this file.
// The request must pass 'protect' first, then 'requireDoctorRole'.
router.use(protect);
router.use(requireDoctorRole);

// --- Define Dashboard Routes ---
// These handlers will only be reached if both 'protect' and 'requireDoctorRole' call next()

router.get('/todays-appointments', getTodaysAppointmentsCount);
router.get('/total-patients', getTotalPatientsCount);
router.get('/completion-rate', getCompletionRate);
router.get('/new-messages', getNewMessagesCount);
router.get('/stats/appointments', getAppointmentStats);
router.get('/stats/patients', getPatientStats);
router.get('/pending-tasks', getPendingTasks);

module.exports = router;