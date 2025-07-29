const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// List of hardcoded/mock user names to remove
const mockUserNames = [
  'Dr. Sarah Smith',
  'Dr. John Smith', 
  'Dr. Sarah Johnson',
  'Dr. Michael Brown',
  'Dr. Sarah Wilson',
  'Dr. Emma Davis',
  'John Doe',
  'Mike Johnson',
  'Admin User'
];

const mockUserEmails = [
  'john@example.com',
  'sarah@example.com',
  'mike@example.com',
  'emma@example.com',
  'admin@example.com'
];

async function cleanupMockUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find all users
    const allUsers = await User.find({});
    console.log('All users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Find mock users by name
    const mockUsersByName = await User.find({
      name: { $in: mockUserNames }
    });
    
    // Find mock users by email
    const mockUsersByEmail = await User.find({
      email: { $in: mockUserEmails }
    });
    
    // Combine and deduplicate
    const mockUsersToDelete = [...mockUsersByName, ...mockUsersByEmail];
    const uniqueMockUsers = mockUsersToDelete.filter((user, index, self) => 
      index === self.findIndex(u => u._id.toString() === user._id.toString())
    );
    
    if (uniqueMockUsers.length === 0) {
      console.log('No mock users found to delete.');
      return;
    }
    
    console.log('\nMock users found to delete:');
    uniqueMockUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Delete mock users
    const deleteResult = await User.deleteMany({
      _id: { $in: uniqueMockUsers.map(u => u._id) }
    });
    
    console.log(`\nDeleted ${deleteResult.deletedCount} mock users.`);
    
    // Show remaining users
    const remainingUsers = await User.find({});
    console.log('\nRemaining users in database:');
    remainingUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error cleaning up mock users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupMockUsers();
