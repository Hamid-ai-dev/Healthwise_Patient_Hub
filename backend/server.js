const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');
const doctorDashboardRoutes = require('./routes/doctor/dashboardRoutes');
const doctorProfileRoutes = require('./routes/doctor/profileRoutes');
const patientRoutes = require('./routes/doctor/patientRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Verify MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    // --- User and Alert Routes ---
    app.use('/api', userRoutes);
    app.use('/api/alerts', alertRoutes);

    // --- Doctor Routes ---
    app.use('/api/doctor', (req, res, next) => {
      console.log(`>>> Doctor Path Request: ${req.method} ${req.originalUrl}`);
      next();
    });

    // Mount specific doctor routes
    app.use('/api/doctor/dashboard', doctorDashboardRoutes);
    app.use('/api/doctor/profile', doctorProfileRoutes);
    app.use('/api/doctor/patient', patientRoutes);

    // --- Basic Error Handler ---
    app.use((err, req, res, next) => {
      console.error("Unhandled Error:", err.stack || err);
      const statusCode = err.statusCode || 500;
      const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message || 'Something went wrong!';
      if (!res.headersSent) {
        res.status(statusCode).json({ message });
      } else {
        next(err);
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();