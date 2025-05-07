// Seed file for Healthwise Patient Hub
// This script populates the database with sample data for development and testing

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Alert = require('./models/Alert');
const Patient = require('./models/doctor/Patient');
const Appointment = require('./models/doctor/Appointment');
const Message = require('./models/doctor/Message');
const Task = require('./models/doctor/Task');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Alert.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await Message.deleteMany();
    await Task.deleteMany();
    console.log('All collections cleared');
  } else {
    console.log('Database clearing skipped (not in development mode)');
  }
};

// Create sample data
const seedDatabase = async () => {
  try {
    console.log('Seeding database...');
    
    // Hash password for security (even in seed data)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create users (doctors, patients, admin)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    const doctorUsers = await User.insertMany([
      {
        name: 'Dr. Sarah Wilson',
        email: 'dr.wilson@example.com',
        password: hashedPassword,
        role: 'doctor'
      },
      {
        name: 'Dr. Michael Johnson',
        email: 'dr.johnson@example.com',
        password: hashedPassword,
        role: 'doctor'
      },
      {
        name: 'Dr. Emily Chen',
        email: 'dr.chen@example.com',
        password: hashedPassword,
        role: 'doctor'
      }
    ]);
    
    const patientUsers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'patient'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'patient'
      },
      {
        name: 'Robert Brown',
        email: 'robert@example.com',
        password: hashedPassword,
        role: 'patient'
      }
    ]);
    
    console.log('Users created');
    
    // Create patients in the Patient collection (separate from user accounts)
    const patients = await Patient.insertMany([
      {
        name: 'John Doe',
        dob: new Date('1985-05-15'),
        gender: 'Male',
        contact: {
          phone: '555-123-4567',
          email: 'john@example.com'
        },
        address: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02108'
        },
        assignedDoctorIds: [doctorUsers[0]._id]
      },
      {
        name: 'Jane Smith',
        dob: new Date('1992-08-22'),
        gender: 'Female',
        contact: {
          phone: '555-987-6543',
          email: 'jane@example.com'
        },
        address: {
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zip: '02109'
        },
        assignedDoctorIds: [doctorUsers[1]._id]
      },
      {
        name: 'Robert Brown',
        dob: new Date('1978-03-10'),
        gender: 'Male',
        contact: {
          phone: '555-456-7890',
          email: 'robert@example.com'
        },
        address: {
          street: '789 Pine St',
          city: 'Cambridge',
          state: 'MA',
          zip: '02139'
        },
        assignedDoctorIds: [doctorUsers[0]._id, doctorUsers[2]._id]
      }
    ]);
    
    console.log('Patients created');
    
    // Create sample appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await Appointment.insertMany([
      {
        doctorId: doctorUsers[0]._id,
        patientId: patients[0]._id,
        patientName: patients[0].name,
        dateTime: new Date(today.setHours(10, 0, 0)),
        status: 'scheduled',
        notes: 'Regular checkup and medication review'
      },
      {
        doctorId: doctorUsers[1]._id,
        patientId: patients[1]._id,
        patientName: patients[1].name,
        dateTime: new Date(tomorrow.setHours(14, 30, 0)),
        status: 'scheduled',
        notes: 'Follow-up after lab tests'
      },
      {
        doctorId: doctorUsers[2]._id,
        patientId: patients[2]._id,
        patientName: patients[2].name,
        dateTime: new Date(nextWeek.setHours(9, 15, 0)),
        status: 'pending',
        notes: 'Initial consultation for persistent headaches'
      },
      {
        doctorId: doctorUsers[0]._id,
        patientId: patients[2]._id,
        patientName: patients[2].name,
        dateTime: new Date(today.setDate(today.getDate() - 7).setHours(11, 0, 0)),
        status: 'completed',
        notes: 'General health assessment, BP was 130/85'
      }
    ]);
    
    console.log('Appointments created');
    
    // Create sample messages
    await Message.insertMany([
      {
        recipientId: doctorUsers[0]._id,
        senderId: adminUser._id,
        senderName: adminUser.name,
        subject: 'New System Update',
        content: 'Please note the system will be undergoing maintenance this weekend. Plan accordingly.',
        isRead: false,
        timestamp: new Date(today.setDate(today.getDate() - 1))
      },
      {
        recipientId: doctorUsers[0]._id,
        senderId: patientUsers[0]._id,
        senderName: patientUsers[0].name,
        subject: 'Question about medication',
        content: 'I\'ve been experiencing some side effects from the new medication. Can we discuss this at my next appointment?',
        isRead: true,
        timestamp: new Date(today.setDate(today.getDate() - 2))
      },
      {
        recipientId: doctorUsers[1]._id,
        senderId: doctorUsers[2]._id,
        senderName: doctorUsers[2].name,
        subject: 'Patient Referral',
        content: 'I\'m referring patient Jane Smith to you for a specialist consultation.',
        isRead: false,
        timestamp: new Date()
      }
    ]);
    
    console.log('Messages created');
    
    // Create sample tasks
    await Task.insertMany([
      {
        assignedToId: doctorUsers[0]._id,
        description: 'Review lab results for John Doe',
        status: 'pending',
        dueDate: new Date(today.setDate(today.getDate() + 2)),
        relatedPatientId: patients[0]._id
      },
      {
        assignedToId: doctorUsers[1]._id,
        description: 'Complete medical report for Jane Smith',
        status: 'overdue',
        dueDate: new Date(today.setDate(today.getDate() - 2)),
        relatedPatientId: patients[1]._id
      },
      {
        assignedToId: doctorUsers[0]._id,
        description: 'Schedule follow-up appointment with Robert Brown',
        status: 'completed',
        dueDate: new Date(today.setDate(today.getDate() - 1)),
        relatedPatientId: patients[2]._id
      },
      {
        assignedToId: doctorUsers[2]._id,
        description: 'Attend department meeting',
        status: 'pending',
        dueDate: new Date(today.setDate(today.getDate() + 1))
      }
    ]);
    
    console.log('Tasks created');
    
    // Create sample alerts
    await Alert.insertMany([
      {
        type: 'system',
        title: 'System Maintenance',
        description: 'The system will be undergoing scheduled maintenance this Saturday from 2AM to 5AM.',
        severity: 'medium',
        time: new Date(),
        details: {
          maintenanceDuration: '3 hours',
          affectedSystems: ['Appointment Scheduling', 'Messaging']
        }
      },
      {
        type: 'contact',
        title: 'New Patient Inquiry',
        description: 'A new patient has submitted a contact form requesting information about services.',
        severity: 'low',
        time: new Date(today.setDate(today.getDate() - 1)),
        details: {
          patientEmail: 'newpatient@example.com',
          requestType: 'Information'
        }
      },
      {
        type: 'system',
        title: 'Critical Update Required',
        description: 'All users must update their passwords within the next 7 days for security compliance.',
        severity: 'high',
        time: new Date(),
        details: {
          deadline: new Date(today.setDate(today.getDate() + 7)),
          reason: 'Security Policy Update'
        }
      }
    ]);
    
    console.log('Alerts created');
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Execute database seeding
const runSeed = async () => {
  await connectDB();
  await clearDatabase();
  await seedDatabase();
  
  console.log('Disconnecting from database...');
  await mongoose.disconnect();
  console.log('Database connection closed');
};

// Run the seed function
runSeed();