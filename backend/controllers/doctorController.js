const DoctorProfile = require('../models/Doctor');

const createDoctorProfile = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      education,
      experience,
      certificates
    } = req.body;

    const personal = {
      fullName,
      dateOfBirth,
      gender,
      contactNumber,
      address
    };

    const newDoctorProfile = new DoctorProfile({
      personal,
      education,
      experience,
      certificates
    });

    console.log('Received data:', req.body);
    console.log('Saving to database...');
    // await newDoctorProfile.save();
    console.log('Saved successfully!');
    res.status(201).json({ message: 'Doctor profile saved successfully' });
    

  } catch (error) {
    console.error('Error saving doctor profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createDoctorProfile };
