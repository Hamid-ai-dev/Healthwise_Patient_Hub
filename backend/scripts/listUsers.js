const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Check if waleed exists and what their password hash looks like
    const waleed = await User.findOne({ email: 'waleed@gmail.com' });
    if (waleed) {
      console.log('\nWaleed user details:');
      console.log('- Name:', waleed.name);
      console.log('- Email:', waleed.email);
      console.log('- Role:', waleed.role);
      console.log('- Password hash exists:', !!waleed.password);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

listUsers();
