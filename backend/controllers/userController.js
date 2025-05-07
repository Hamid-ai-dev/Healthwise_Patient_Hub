const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if all fields are filled
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already used' });
    }

    // Secure the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save user to MongoDB
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are filled
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Or your preferred expiration time
    );

    // Send token with response
    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { registerUser, loginUser };
