const PatientRecord = require('../../models/doctor/PatientRecord');

const mongoose = require('mongoose');




const getPatients = async (req, res) => {
  try {
    const patients = await PatientRecord.find({ doctor: req.user._id }).select('name');
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      image: req.file ? `Image received: ${req.file.filename}` : 'No image received'
    });

    // Validate required fields
    if (!name || !age || !gender || !phone || !address || !email ||
        !height || !weight || !bloodPressure || !heartRate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new patient record
    const newPatient = new PatientRecord({
      name,
      age,
      gender,
      phone,
      address,
      email, 
      height,
      weight,
      bloodPressure,
      heartRate,
      // Store image path if file exists, otherwise null
      image: req.file ? `/uploads/${req.file.filename}` : null,
      doctor: req.user.id
    });

    // Save patient record
    const savedPatient = await newPatient.save();
    
    res.status(201).json({
      message: 'Patient added successfully',
      patient: savedPatient
    });
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

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    // Implementation will be added here
    res.status(200).json({ message: 'Get all patients endpoint' });
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

// Get patient by ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    // Implementation will be added here
    res.status(200).json({ message: `Get patient with ID: ${id}` });
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({ message: 'Error fetching patient details' });
  }
};

module.exports = { addDoctorsPatient , getPatients, getAllPatients, getPatientById};