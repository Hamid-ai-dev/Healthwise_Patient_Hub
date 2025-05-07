const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate emails 
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor' , 'admin'] // Only allows these values
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;