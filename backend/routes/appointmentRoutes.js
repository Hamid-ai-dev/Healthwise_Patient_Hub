const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  getAvailableDoctors,
  getAvailableSlots,
  getAppointmentStats,
  deleteAppointment
} = require('../controllers/appointmentController');

// Apply authentication middleware to all routes
router.use(protect);

// GET /api/appointments - Get all appointments for the current user
router.get('/', getAppointments);

// GET /api/appointments/stats - Get appointment statistics for dashboard
router.get('/stats', getAppointmentStats);

// GET /api/appointments/doctors - Get available doctors for scheduling
router.get('/doctors', getAvailableDoctors);

// GET /api/appointments/available-slots - Get available time slots for a doctor
router.get('/available-slots', getAvailableSlots);

// GET /api/appointments/:appointmentId - Get a specific appointment by ID
router.get('/:appointmentId', getAppointmentById);

// POST /api/appointments - Create a new appointment
router.post('/', createAppointment);

// PUT /api/appointments/:appointmentId/status - Update appointment status
router.put('/:appointmentId/status', updateAppointmentStatus);

// DELETE /api/appointments/:appointmentId - Cancel/Delete an appointment
router.delete('/:appointmentId', deleteAppointment);

module.exports = router;
