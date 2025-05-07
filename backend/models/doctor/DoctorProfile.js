const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  gradYear: { type: Number, required: true },
  country: { type: String },
  specialization: { type: String },
});

const ExperienceSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
});

const CertificationSchema = new mongoose.Schema({
  certificate: { type: String, required: true }, // Matches frontend 'certificate'
  authority: { type: String, required: true }, // Matches frontend 'authority'
  certYear: { type: Number, required: true }, // Matches frontend 'certYear'
});

const PersonalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
});


const DoctorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true, // Each user (doctor) can have only one profile
  },
  personal: {
    type: PersonalInfoSchema, // Embed the single personal info object
    required: true,
  },
  education: [EducationSchema], // Array of education details
  experience: [ExperienceSchema], // Array of experience details
  certifications: [CertificationSchema], // Array of certification details, name changed to match frontend call
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

const DoctorProfile = mongoose.model('DoctorProfile', DoctorProfileSchema);

module.exports = DoctorProfile;