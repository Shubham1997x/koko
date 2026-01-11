/**
 * API Service for communicating with backend
 * API URL can be configured via window.VetChatbotConfig.apiUrl
 */

function getApiUrl() {
  if (typeof window !== 'undefined' && window.VetChatbotConfig && window.VetChatbotConfig.apiUrl) {
    return window.VetChatbotConfig.apiUrl;
  }
  // Default to localhost for development
  // In production, this should be set via VetChatbotConfig.apiUrl
  return 'http://localhost:3000';
}

/**
 * Send chat message to backend
 * @param {string} sessionId - Session ID
 * @param {string} message - User message
 * @param {Object} context - Optional context (userId, userName, petName, source)
 * @returns {Promise<Object>} Response from backend
 */
export async function sendMessage(sessionId, message, context = {}) {
  try {
    const response = await fetch(`${getApiUrl()}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        message,
        context,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Create appointment
 * @param {string} sessionId - Session ID
 * @param {Object} appointmentData - Appointment details
 * @returns {Promise<Object>} Created appointment
 */
export async function createAppointment(sessionId, appointmentData) {
  try {
    const response = await fetch(`${getApiUrl()}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        ...appointmentData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorObj = new Error(error.error || 'Failed to create appointment');
      errorObj.response = error;
      throw errorObj;
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

/**
 * Get conversation history
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Conversation data
 */
export async function getConversation(sessionId) {
  try {
    const response = await fetch(`${getApiUrl()}/api/conversations/${sessionId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { messages: [] };
      }
      throw new Error('Failed to fetch conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return { messages: [] };
  }
}

