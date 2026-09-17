const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');

// ======================================================
// CREATE
// POST /api/appointments
// ======================================================

router.post('/', async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      doctorName,
      specialty,
      appointmentDate,
      appointmentTime,
      consultationType,
      notes
    } = req.body;

    if (
      !patientName ||
      !patientEmail ||
      !doctorName ||
      !specialty ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        message: 'Please fill all required fields.'
      });
    }

    const appointment = new Appointment({
      patientName,
      patientEmail,
      doctorName,
      specialty,
      appointmentDate,
      appointmentTime,
      consultationType,
      notes
    });

    const savedAppointment = await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully.',
      appointment: savedAppointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);

    res.status(500).json({
      message: 'Failed to create appointment.'
    });
  }
});


// ======================================================
// READ ALL
// GET /api/appointments
// ======================================================

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {
    console.error('Get appointments error:', error);

    res.status(500).json({
      message: 'Failed to fetch appointments.'
    });
  }
});


// ======================================================
// READ ONE
// GET /api/appointments/:id
// ======================================================

router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.'
      });
    }

    res.status(200).json(appointment);

  } catch (error) {
    console.error('Get appointment error:', error);

    res.status(500).json({
      message: 'Failed to fetch appointment.'
    });
  }
});


// ======================================================
// UPDATE
// PUT /api/appointments/:id
// ======================================================

router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.'
      });
    }

    res.status(200).json({
      message: 'Appointment updated successfully.',
      appointment
    });

  } catch (error) {
    console.error('Update appointment error:', error);

    res.status(500).json({
      message: 'Failed to update appointment.'
    });
  }
});


// ======================================================
// DELETE
// DELETE /api/appointments/:id
// ======================================================

router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.'
      });
    }

    res.status(200).json({
      message: 'Appointment deleted successfully.'
    });

  } catch (error) {
    console.error('Delete appointment error:', error);

    res.status(500).json({
      message: 'Failed to delete appointment.'
    });
  }
});


module.exports = router;