const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB Atlas URI
const MONGO_URI = 'mongodb+srv://myuser:mypassword123@cluster0.nnlrukw.mongodb.net/healwise?retryWrites=true&w=majority&appName=Cluster0';

// Define schema directly here (you can also import your model if you want)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'], // ✅ 'admin' added
    required: true
  }
});

const User = mongoose.model('User', userSchema);

async function addAdmins() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const hashedPassword = await bcrypt.hash('12345678', 10); // 🔒 Hash password

    const admins = [
      {
        name: 'Abdullah Cheema',
        email: 'abdullahcheema@gmail.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Abdullah Amjad',
        email: 'abdullahajad@gmail.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Hamid Ali',
        email: 'hamidali@gmail.com',
        password: hashedPassword,
        role: 'admin'
      }
    ];

    const inserted = await User.insertMany(admins);
    console.log('✅ Admins inserted:', inserted);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error inserting admins:', error.message);
  }
}

addAdmins();
