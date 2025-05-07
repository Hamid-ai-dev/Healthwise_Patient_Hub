const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Add other relevant patient details
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  contact: {
    phone: String,
    email: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  // Link patient to their primary doctor(s) - an array allows multiple doctors
  assignedDoctorIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  }],
  // You might want medical history, etc. here too
  // medicalHistory: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;