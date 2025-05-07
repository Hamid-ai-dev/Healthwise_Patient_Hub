const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

// Initialize GridFS storage after ensuring Mongoose connection is ready
const initializeStorage = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongoose connection is not established');
  }

  return new GridFsStorage({
    db: mongoose.connection,
    file: (req, file) => {
      return {
        filename: `patient_${Date.now()}_${file.originalname}`,
        bucketName: 'uploads'
      };
    }
  });
};

// Create storage instance
const storage = multer.memoryStorage(); // Fallback to memory storage initially
mongoose.connection.once('open', () => {
  // Replace with GridFS storage once connection is open
  module.exports.storage = initializeStorage();
});

// Configure multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;