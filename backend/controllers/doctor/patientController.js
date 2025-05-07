const PatientRecord = require('../../models/doctor/PatientRecord');
const mongoose = require('mongoose');

// Create a new patient record
const addDoctorsPatient = async (req, res) => {
  try {
    const {
      name, age, gender, phone, address, email,
      height, weight, bloodPressure, heartRate
    } = req.body;

    // Log received data for debugging
    console.log('Received patient data:', {
      ...req.body,
      image: req.file ? `Image: ${req.file.filename}, ID: ${req.file.id}` : 'No image received'
    });

    // Validate required fields
    if (!name || !age || !gender || !phone || !address || !email ||
        !height || !weight || !bloodPressure || !heartRate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate file presence
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }s

    // Validate data types and formats
    if (isNaN(parseInt(age))) {
      return res.status(400).json({ message: 'Age must be a valid number' });
    }
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender value' });
    }
    if (isNaN(parseInt(weight))) {
      return res.status(400).json({ message: 'Weight must be a valid number' });
    }

    // Create patient record
    const patientData = {
      name,
      age: parseInt(age),
      gender,
      phone,
      address,
      email,
      height,
      weight: parseInt(weight),
      bloodPressure,
      heartRate,
      image: req.file.id, // Store GridFS file ID
      doctor: req.user._id, // Link to logged-in doctor
      queries: []
    };

    const patient = await PatientRecord.create(patientData);
    res.status(201).json({ message: 'Patient added successfully', patient });
  } catch (error) {
    // Log detailed error
    console.error('Error adding patient:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${error.message}` });
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate email not allowed' });
    }
    res.status(500).json({ message: `Server error while adding patient: ${error.message}` });
  }
};

module.exports = { addDoctorsPatient };