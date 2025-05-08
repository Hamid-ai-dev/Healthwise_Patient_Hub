const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: Number, required: true },
  bloodPressure: { type: String, required: true },
  heartRate: { type: String, required: true },
  image: { type: String, required: false }, // Changed to String to store file path
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  queries: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);