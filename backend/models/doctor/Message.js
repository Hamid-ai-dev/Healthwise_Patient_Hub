const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  recipientId: { // The Doctor receiving the message
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  senderId: { // Could be a Patient (User model if patients can login) or another Doctor/Admin
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Or potentially 'Patient' if patients are separate
    required: true,
  },
  senderName: { // Denormalized for display
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true, // Index for finding unread messages
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;