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
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }, // Reference to GridFS file
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to doctor
  queries: [{ type: String }], // Array for future queries
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);