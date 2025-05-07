const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (specifically a doctor)
    required: true,
    index: true, // Index for faster querying by doctorId
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
    index: true, // Index for faster querying by patientId
  },
  patientName: { // Denormalized for easier display, update if Patient name changes
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
    index: true, // Index for faster querying by date
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'completed', 'cancelled', 'pending'],
    default: 'scheduled',
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure doctorId and dateTime combination is unique if needed, or handle duplicates logically
// appointmentSchema.index({ doctorId: 1, dateTime: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;