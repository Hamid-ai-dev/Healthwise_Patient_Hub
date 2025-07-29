const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getContacts,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount
} = require('../controllers/messageController');

// Apply authentication middleware to all routes
router.use(protect);

// GET /api/messages/contacts - Get all contacts for the current user
router.get('/contacts', getContacts);

// GET /api/messages/conversation/:contactId - Get conversation with a specific contact
router.get('/conversation/:contactId', getConversation);

// POST /api/messages/send - Send a new message
router.post('/send', sendMessage);

// PUT /api/messages/read/:contactId - Mark messages from a contact as read
router.put('/read/:contactId', markAsRead);

// GET /api/messages/unread-count - Get unread message count for current user
router.get('/unread-count', getUnreadCount);

module.exports = router;
