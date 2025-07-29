const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { // User sending the message (can be patient, doctor, or admin)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  receiverId: { // User receiving the message (can be patient, doctor, or admin)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'document'],
    default: 'text',
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true, // Index for finding unread messages
  },
  readAt: {
    type: Date,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Optional fields for future enhancements
  subject: {
    type: String,
    trim: true,
  },
  attachmentUrl: {
    type: String,
  },
  attachmentType: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Compound indexes for better query performance
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
messageSchema.index({ receiverId: 1, isRead: 1, timestamp: -1 });

// Virtual for getting conversation participants
messageSchema.virtual('participants').get(function() {
  return [this.senderId, this.receiverId];
});

// Method to mark message as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = function(userId1, userId2, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 }
    ]
  })
  .populate('senderId', 'name email role')
  .populate('receiverId', 'name email role')
  .sort({ timestamp: -1 })
  .limit(limit)
  .skip(skip);
};

// Static method to get unread message count for a user
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    receiverId: userId,
    isRead: false
  });
};

// Static method to get contacts for a user (people they've messaged with)
messageSchema.statics.getContacts = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(userId) },
          { receiverId: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
            '$receiverId',
            '$senderId'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'contact'
      }
    },
    {
      $unwind: '$contact'
    },
    {
      $project: {
        _id: 1,
        contact: {
          _id: '$contact._id',
          name: '$contact.name',
          email: '$contact.email',
          role: '$contact.role'
        },
        lastMessage: {
          content: '$lastMessage.content',
          timestamp: '$lastMessage.timestamp',
          isRead: '$lastMessage.isRead',
          senderId: '$lastMessage.senderId'
        },
        unreadCount: 1
      }
    },
    {
      $sort: { 'lastMessage.timestamp': -1 }
    }
  ]);
};

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;