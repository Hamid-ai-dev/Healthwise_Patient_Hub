const DoctorProfile = require('../../models/doctor/DoctorProfile');
const User = require('../../models/User'); // To verify user exists

const saveDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from protect middleware

    // Check if the user exists and is a doctor (double-check, though middleware handles role)
    const doctorUser = await User.findById(userId);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      return res.status(403).json({ message: 'User is not authorized or not found' });
    }

    // Extract data from the request body, matching the reshaped structure from frontend
    const { personal, education, experience, certificates } = req.body;

    // Basic validation: Check if essential parts exist
    if (!personal || !Array.isArray(personal) || personal.length === 0 || !education || !experience || !certificates) {
        return res.status(400).json({ message: 'Missing required profile sections in request body' });
    }

    // Prepare data for saving/updating
    // Use the first element from the 'personal' array sent by the frontend
    const personalData = personal[0];
     if (!personalData || !personalData.fullName || !personalData.dateOfBirth || !personalData.gender || !personalData.contactNumber || !personalData.address) {
        return res.status(400).json({ message: 'Missing required fields in personal information' });
     }

    const profileData = {
      user: userId,
      personal: {
        fullName: personalData.fullName,
        dateOfBirth: new Date(personalData.dateOfBirth), // Convert string to Date
        gender: personalData.gender,
        contactNumber: personalData.contactNumber,
        address: personalData.address,
      },
      education: education.map(edu => ({ // Ensure all required education fields are present
        degree: edu.degree,
        institution: edu.institution,
        gradYear: edu.gradYear,
        country: edu.country,
        specialization: edu.specialization
      })),
      experience: experience.map(exp => ({ // Ensure all required experience fields are present
        institution: exp.institution,
        position: exp.position,
        startDate: new Date(exp.startDate), // Convert string to Date
        endDate: new Date(exp.endDate), // Convert string to Date
        description: exp.description
      })),
      // Use 'certificates' from req.body and map to 'certifications' in the schema
      certifications: certificates.map(cert => ({ // Ensure all required certification fields are present
        certificate: cert.certificate,
        authority: cert.authority,
        certYear: cert.certYear
      })),
    };

    // Use findOneAndUpdate with upsert: true to create or update the profile
    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { user: userId }, // Find profile by user ID
      profileData, // Data to save/update
      {
        new: true, // Return the updated document
        upsert: true, // Create if it doesn't exist
        runValidators: true, // Run schema validation on update
      }
    );

    res.status(200).json({ message: 'Doctor profile saved successfully', profile: updatedProfile });

  } catch (error) {
    console.error('Error saving doctor profile:', error);
     // Handle validation errors specifically
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while saving profile', error: error.message });
  }
};

module.exports = {
  saveDoctorProfile,
};