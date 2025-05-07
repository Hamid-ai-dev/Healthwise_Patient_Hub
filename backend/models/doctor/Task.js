const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  assignedToId: { // The Doctor the task is assigned to
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending',
    index: true,
  },
  dueDate: {
    type: Date,
    index: true,
  },
  relatedPatientId: { // Optional link to a patient
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add completedAt if needed
});

// Pre-save hook to update status to 'overdue' if needed (optional, can be done in query)
taskSchema.pre('save', function (next) {
  if (this.status === 'pending' && this.dueDate && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;