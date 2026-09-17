const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },

    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    doctorName: {
      type: String,
      required: true,
      trim: true
    },

    specialty: {
      type: String,
      required: true,
      trim: true
    },

    appointmentDate: {
      type: String,
      required: true
    },

    appointmentTime: {
      type: String,
      required: true
    },

    consultationType: {
      type: String,
      enum: ['online', 'in-clinic'],
      default: 'online'
    },

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },

    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);