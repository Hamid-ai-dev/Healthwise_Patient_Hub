const Message = require('../models/doctor/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all contacts for the current user based on their role
const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let contacts = [];

    if (userRole === 'doctor') {
      // Doctors can message all patients and other doctors
      contacts = await User.find({
        $and: [
          { _id: { $ne: userId } }, // Exclude self
          { role: { $in: ['patient', 'doctor'] } } // Include patients and doctors
        ]
      }).select('_id name email role');
    } else if (userRole === 'patient') {
      // Patients can message all doctors
      contacts = await User.find({
        $and: [
          { _id: { $ne: userId } }, // Exclude self
          { role: 'doctor' } // Only doctors
        ]
      }).select('_id name email role');
    } else if (userRole === 'admin') {
      // Admins can message everyone
      contacts = await User.find({
        _id: { $ne: userId } // Exclude self
      }).select('_id name email role');
    }

    // Get conversation data for each contact
    const contactsWithLastMessage = await Promise.all(
      contacts.map(async (contact) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: contact._id },
            { senderId: contact._id, receiverId: userId }
          ]
        })
        .sort({ timestamp: -1 })
        .populate('senderId', 'name');

        const unreadCount = await Message.countDocuments({
          senderId: contact._id,
          receiverId: userId,
          isRead: false
        });

        return {
          _id: contact._id,
          name: contact.name,
          email: contact.email,
          role: contact.role,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.timestamp,
            isRead: lastMessage.isRead,
            senderId: lastMessage.senderId._id,
            senderName: lastMessage.senderId.name
          } : null,
          unreadCount
        };
      })
    );

    // Sort by last message timestamp (most recent first)
    contactsWithLastMessage.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });

    res.status(200).json({
      success: true,
      contacts: contactsWithLastMessage
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Get conversation between current user and another user
const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Validate contactId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }

    // Check if contact exists
    const contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Get messages between users
    const skip = (page - 1) * limit;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId }
      ]
    })
    .populate('senderId', 'name email role')
    .populate('receiverId', 'name email role')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .skip(skip);

    // Reverse to show oldest first
    messages.reverse();

    // Mark messages as read if they were sent to current user
    await Message.updateMany(
      {
        senderId: contactId,
        receiverId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      messages,
      contact: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        role: contact.role
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, content, messageType = 'text' } = req.body;

    // Validate input
    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiver ID'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Validate message permissions based on user roles
    const senderRole = req.user.role;
    const receiverRole = receiver.role;

    if (senderRole === 'patient' && receiverRole !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Patients can only message doctors'
      });
    }

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      content: content.trim(),
      messageType,
      timestamp: new Date()
    });

    await newMessage.save();

    // Populate sender and receiver info
    await newMessage.populate('senderId', 'name email role');
    await newMessage.populate('receiverId', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }

    // Mark all unread messages from this contact as read
    const result = await Message.updateMany(
      {
        senderId: contactId,
        receiverId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Message.countDocuments({
      receiverId: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

module.exports = {
  getContacts,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount
};
