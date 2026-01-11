const Appointment = require('../models/Appointment');
const { validateAppointmentData } = require('../services/appointmentService');

/**
 * Create appointment
 * POST /api/appointments
 */
async function createAppointment(req, res) {
  try {
    const { sessionId, petOwnerName, petName, phoneNumber, preferredDate } = req.body;

    // Validate required fields
    if (!sessionId || !petOwnerName || !petName || !phoneNumber || !preferredDate) {
      return res.status(400).json({
        error: 'All fields are required: sessionId, petOwnerName, petName, phoneNumber, preferredDate',
      });
    }

    // Validate appointment data
    const validation = validateAppointmentData({
      petOwnerName,
      petName,
      phoneNumber,
      preferredDate,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Create appointment
    const appointment = new Appointment({
      sessionId,
      petOwnerName,
      petName,
      phoneNumber,
      preferredDate: new Date(preferredDate),
      status: 'pending',
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: {
        id: appointment._id,
        petOwnerName: appointment.petOwnerName,
        petName: appointment.petName,
        phoneNumber: appointment.phoneNumber,
        preferredDate: appointment.preferredDate,
        status: appointment.status,
        createdAt: appointment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

module.exports = {
  createAppointment,
};

