const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['system', 'contact']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['high', 'medium', 'low']
  },
  time: {
    type: Date,
    default: Date.now
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('Alert', alertSchema);