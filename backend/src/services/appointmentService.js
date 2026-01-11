/**
 * Appointment Booking Service
 * Handles appointment booking state and logic
 */

// Appointment booking states
const BOOKING_STATES = {
  IDLE: 'idle',
  DETECTED_INTENT: 'detected_intent',
  COLLECTING_OWNER_NAME: 'collecting_owner_name',
  COLLECTING_PET_NAME: 'collecting_pet_name',
  COLLECTING_PHONE: 'collecting_phone',
  COLLECTING_DATE: 'collecting_date',
  CONFIRMING: 'confirming',
};

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
 * Extract information from user message using simple patterns
 * @param {string} message - User message
 * @param {string} field - Field to extract (name, phone, date, pet)
 * @returns {string|null} - Extracted value or null
 */
function extractField(message, field) {
  const lowerMessage = message.toLowerCase();

  if (field === 'phone') {
    // Match phone patterns: (123) 456-7890, 123-456-7890, 1234567890, etc.
    const phoneRegex = /[\d\s\-\(\)\+]{10,}/;
    const match = message.match(phoneRegex);
    if (match) {
      // Clean and validate
      const cleaned = match[0].replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return match[0].trim();
      }
    }
  }

  if (field === 'date') {
    // Match common date patterns
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{2,4}/, // MM/DD/YYYY
      /\d{1,2}-\d{1,2}-\d{2,4}/, // MM-DD-YYYY
      /(today|tomorrow|next week|next month)/i,
      /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    ];

    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) return match[0];
    }
  }

  // For name and pet name, we'll rely on user input in context
  // This is a simple implementation - could be enhanced with NLP
  return null;
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
  BOOKING_STATES,
  detectAppointmentIntent,
  extractField,
  validateAppointmentData,
};

