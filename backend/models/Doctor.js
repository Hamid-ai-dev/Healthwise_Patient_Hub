const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  graduationYear: { type: Number },
  country: String,
  specialization: String,
});

const experienceSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true }, // Use ISO format or Date type
  endDate: { type: Date, required: true },
  description: String,
});

const certificateSchema = new mongoose.Schema({
  certificateName: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueYear: { type: Number, required: true },
});

const personalprofileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
});

const DoctorProfileSchema = new mongoose.Schema({
  personal: [personalprofileSchema],
  education: [educationSchema],
  experience: [experienceSchema],
  certificates: [certificateSchema],
});

module.exports = mongoose.model("Doctorprofile", DoctorProfileSchema);
