const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (specifically a doctor)
    required: true,
    index: true, // Index for faster querying by doctorId
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (specifically a patient)
    required: true,
    index: true, // Index for faster querying by patientId
  },
  dateTime: {
    type: Date,
    required: true,
    index: true, // Index for faster querying by date
  },
  duration: {
    type: Number, // Duration in minutes
    default: 30,
    min: 15,
    max: 180
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'completed', 'cancelled', 'pending', 'confirmed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'checkup', 'emergency', 'routine'],
    default: 'consultation'
  },
  notes: {
    type: String,
    trim: true,
  },
  patientNotes: {
    type: String,
    trim: true,
  },
  doctorNotes: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  symptoms: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    trim: true,
  },
  confirmedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Compound indexes for better query performance
appointmentSchema.index({ doctorId: 1, dateTime: 1 });
appointmentSchema.index({ patientId: 1, dateTime: 1 });
appointmentSchema.index({ status: 1, dateTime: 1 });
appointmentSchema.index({ dateTime: 1, status: 1 });

// Virtual for appointment end time
appointmentSchema.virtual('endTime').get(function() {
  return new Date(this.dateTime.getTime() + (this.duration * 60000));
});

// Virtual for checking if appointment is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  return this.dateTime > new Date() && this.status === 'scheduled';
});

// Virtual for checking if appointment is today
appointmentSchema.virtual('isToday').get(function() {
  const today = new Date();
  const appointmentDate = new Date(this.dateTime);
  return appointmentDate.toDateString() === today.toDateString();
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentTime = new Date(this.dateTime);
  const timeDiff = appointmentTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);

  return this.status === 'scheduled' && hoursDiff >= 2; // Can cancel if at least 2 hours before
};

// Method to mark appointment as completed
appointmentSchema.methods.markAsCompleted = function(doctorNotes = '') {
  this.status = 'completed';
  this.completedAt = new Date();
  if (doctorNotes) {
    this.doctorNotes = doctorNotes;
  }
  return this.save();
};

// Method to cancel appointment
appointmentSchema.methods.cancelAppointment = function(cancelledBy, reason = '') {
  this.status = 'cancelled';
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  if (reason) {
    this.cancellationReason = reason;
  }
  return this.save();
};

// Method to confirm appointment
appointmentSchema.methods.confirmAppointment = function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  return this.save();
};

// Static method to get appointments for a specific date range
appointmentSchema.statics.getAppointmentsByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    dateTime: {
      $gte: startDate,
      $lte: endDate
    },
    ...filters
  };

  return this.find(query)
    .populate('doctorId', 'name email')
    .populate('patientId', 'name email')
    .sort({ dateTime: 1 });
};

// Static method to check for appointment conflicts
appointmentSchema.statics.checkConflict = function(doctorId, dateTime, duration = 30, excludeId = null) {
  const startTime = new Date(dateTime);
  const endTime = new Date(startTime.getTime() + (duration * 60000));

  const query = {
    doctorId,
    status: { $in: ['scheduled', 'confirmed'] },
    $or: [
      {
        dateTime: { $lt: endTime },
        $expr: {
          $gt: [
            { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
            startTime
          ]
        }
      }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return this.findOne(query);
};

// Static method to get available time slots for a doctor on a specific date
appointmentSchema.statics.getAvailableSlots = async function(doctorId, date, duration = 30) {
  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // Start at 9 AM

  const endOfDay = new Date(date);
  endOfDay.setHours(17, 0, 0, 0); // End at 5 PM

  const existingAppointments = await this.find({
    doctorId,
    dateTime: {
      $gte: startOfDay,
      $lt: endOfDay
    },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ dateTime: 1 });

  const slots = [];
  const slotDuration = duration; // minutes

  for (let time = new Date(startOfDay); time < endOfDay; time.setMinutes(time.getMinutes() + slotDuration)) {
    const slotEnd = new Date(time.getTime() + (slotDuration * 60000));

    // Check if this slot conflicts with any existing appointment
    const hasConflict = existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.dateTime);
      const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.duration * 60000));

      return (time < appointmentEnd && slotEnd > appointmentStart);
    });

    if (!hasConflict) {
      slots.push(new Date(time));
    }
  }

  return slots;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;