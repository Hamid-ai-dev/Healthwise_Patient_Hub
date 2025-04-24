const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');
require('dotenv').config();

const app = express();
const port = 5000;

// Allow frontend to talk to backend
app.use(cors());
// Understand JSON data from frontend
app.use(express.json());
// Connect to MongoDB
connectDB();
// Use signup routes
app.use('/api', userRoutes);

app.use('/api/alerts', alertRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});