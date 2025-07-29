const Appointment = require('../models/doctor/Appointment');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all appointments for the current user (patient or doctor)
const getAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};
    
    // Build query based on user role
    if (userRole === 'patient') {
      query.patientId = userId;
    } else if (userRole === 'doctor') {
      query.doctorId = userId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) {
        query.dateTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.dateTime.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get appointments with populated user data
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .sort({ dateTime: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const hasAccess = (userRole === 'patient' && appointment.patientId._id.toString() === userId.toString()) ||
                     (userRole === 'doctor' && appointment.doctorId._id.toString() === userId.toString()) ||
                     userRole === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { 
      doctorId, 
      dateTime, 
      duration = 30, 
      type = 'consultation',
      reason,
      symptoms,
      notes,
      priority = 'medium'
    } = req.body;

    // Validate required fields
    if (!doctorId || !dateTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID, date/time, and reason are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }

    // Check if doctor exists and is actually a doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Validate appointment date (must be in the future)
    const appointmentDate = new Date(dateTime);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      });
    }

    // Check for appointment conflicts
    const conflict = await Appointment.checkConflict(doctorId, appointmentDate, duration);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Doctor is not available at this time',
        conflictingAppointment: {
          dateTime: conflict.dateTime,
          duration: conflict.duration
        }
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      dateTime: appointmentDate,
      duration,
      type,
      reason,
      symptoms,
      notes,
      priority,
      status: 'pending'
    });

    await newAppointment.save();

    // Populate the appointment with user data
    await newAppointment.populate('doctorId', 'name email');
    await newAppointment.populate('patientId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, doctorNotes, cancellationReason } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check permissions
    const hasAccess = (userRole === 'patient' && appointment.patientId.toString() === userId.toString()) ||
                     (userRole === 'doctor' && appointment.doctorId.toString() === userId.toString()) ||
                     userRole === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Handle different status updates
    switch (status) {
      case 'confirmed':
        if (userRole !== 'doctor') {
          return res.status(403).json({
            success: false,
            message: 'Only doctors can confirm appointments'
          });
        }
        await appointment.confirmAppointment();
        break;

      case 'completed':
        if (userRole !== 'doctor') {
          return res.status(403).json({
            success: false,
            message: 'Only doctors can mark appointments as completed'
          });
        }
        await appointment.markAsCompleted(doctorNotes);
        break;

      case 'cancelled':
        if (!appointment.canBeCancelled()) {
          return res.status(400).json({
            success: false,
            message: 'Appointment cannot be cancelled (less than 2 hours before appointment time)'
          });
        }
        await appointment.cancelAppointment(userId, cancellationReason);
        break;

      default:
        appointment.status = status;
        await appointment.save();
    }

    // Populate and return updated appointment
    await appointment.populate('doctorId', 'name email');
    await appointment.populate('patientId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// Get available doctors for appointment scheduling
const getAvailableDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// Get available time slots for a doctor on a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date, duration = 30 } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }

    const selectedDate = new Date(date);
    if (selectedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Date must be in the future'
      });
    }

    const availableSlots = await Appointment.getAvailableSlots(doctorId, selectedDate, parseInt(duration));

    res.status(200).json({
      success: true,
      availableSlots: availableSlots.map(slot => ({
        dateTime: slot,
        time: slot.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }))
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

// Get appointment statistics for dashboard
const getAppointmentStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === 'patient') {
      query.patientId = userId;
    } else if (userRole === 'doctor') {
      query.doctorId = userId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments
    ] = await Promise.all([
      Appointment.countDocuments(query),
      Appointment.countDocuments({
        ...query,
        dateTime: { $gte: startOfToday, $lte: endOfToday }
      }),
      Appointment.countDocuments({
        ...query,
        status: { $in: ['scheduled', 'confirmed'] },
        dateTime: { $gte: new Date() }
      }),
      Appointment.countDocuments({
        ...query,
        status: 'completed'
      }),
      Appointment.countDocuments({
        ...query,
        status: 'cancelled'
      })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalAppointments,
        today: todayAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment stats',
      error: error.message
    });
  }
};

// Delete/Cancel appointment
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check permissions
    const hasAccess = (userRole === 'patient' && appointment.patientId.toString() === userId.toString()) ||
                     (userRole === 'doctor' && appointment.doctorId.toString() === userId.toString()) ||
                     userRole === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled (less than 2 hours before appointment time)'
      });
    }

    await appointment.cancelAppointment(userId, reason);

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  getAvailableDoctors,
  getAvailableSlots,
  getAppointmentStats,
  deleteAppointment
};
