const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const protect = async (req, res, next) => {
  let token;
  console.log('--- Protect Middleware ---'); // Log entry
  console.log('Request Headers:', req.headers.authorization); // Log the auth header

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted Token:', token); // Log the extracted token

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token Payload:', decoded); // Log the decoded payload

      // Get user from the token (select -password to exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found in DB:', req.user ? `ID: ${req.user._id}, Role: ${req.user.role}` : 'null'); // Log the user found

      if (!req.user) {
        console.log('User lookup failed for ID:', decoded.id); // Log if user not found
        return res.status(401).json({ message: 'Not authorized, user associated with token not found' });
      }

      // If user is found, proceed to the next middleware
      console.log('User authenticated, proceeding...');
      next();
      return;
    } catch (error) {
      console.error('Token verification or DB lookup failed:', error.name, error.message); // Log the specific error
      return res.status(401).json({ message: 'Not authorized, token failed or invalid' });
    }
  }

  // If no token was found in the authorization header
  console.log('No token found or extracted.');
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

const requireDoctorRole = (req, res, next) => {
    console.log('--- Require Doctor Role Middleware ---'); // Log entry
    // Check if req.user exists from the 'protect' middleware
    if (!req.user) {
        console.log('Role check skipped: req.user is not defined (authentication likely failed earlier).');
        // If protect failed, it should have already sent a response.
        // Sending another response here might cause issues, but we add a safeguard.
        if (!res.headersSent) {
            return res.status(401).json({ message: 'Authentication required before role check.' });
        }
        // If a response was already sent, just stop processing.
        return;
    }

    console.log(`Checking role for user ${req.user._id}: Actual Role = '${req.user.role}'`); // Log the user and role being checked

    if (req.user.role === 'doctor') {
        console.log('Role check passed.');
        next(); // Role is correct, proceed
    } else {
        console.log(`Role check failed. Expected 'doctor', got '${req.user.role}'.`);
        res.status(403).json({ message: 'Access denied. Doctor role required.' }); // Forbidden
    }
};


module.exports = { protect, requireDoctorRole };