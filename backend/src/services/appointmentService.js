/**
 * Appointment Booking Service
 * Handles appointment booking logic
 */

/**
 * Detect if user wants to book an appointment
 * @param {string} message - User message
 * @returns {boolean} - True if intent detected
 */
function detectAppointmentIntent(message) {
  const lowerMessage = message.toLowerCase();
  const keywords = [
    'book',
    'schedule',
    'appointment',
    'visit',
    'make an appointment',
    'set up',
    'reserve',
    'need to see',
    'want to see',
    'vet visit',
  ];

  return keywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Validate appointment data
 * @param {Object} data - Appointment data
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
function validateAppointmentData(data) {
  const errors = [];

  if (!data.petOwnerName || data.petOwnerName.trim().length < 2) {
    errors.push('Pet owner name must be at least 2 characters');
  }

  if (!data.petName || data.petName.trim().length < 1) {
    errors.push('Pet name is required');
  }

  if (!data.phoneNumber || !/[\d\s\-\(\)\+]{10,}/.test(data.phoneNumber)) {
    errors.push('Valid phone number is required');
  }

  if (!data.preferredDate) {
    errors.push('Preferred date is required');
  } else {
    const date = new Date(data.preferredDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else if (date < new Date()) {
      errors.push('Appointment date cannot be in the past');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  detectAppointmentIntent,
  validateAppointmentData,
};

