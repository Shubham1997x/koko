/**
 * API Service for communicating with backend
 * API URL can be configured via window.VetChatbotConfig.apiUrl
 * Automatically falls back to Render backend if local backend is unavailable
 */

function getApiUrl() {
  // Priority 1: User-provided config (highest priority)
  if (typeof window !== 'undefined' && window.VetChatbotConfig && window.VetChatbotConfig.apiUrl) {
    return window.VetChatbotConfig.apiUrl;
  }
  
  // Priority 2: Environment variable (set at build time)
  if (typeof process !== 'undefined' && process.env && process.env.VET_CHATBOT_API_URL) {
    return process.env.VET_CHATBOT_API_URL;
  }
  
  // Priority 3: Default fallback
  return 'http://localhost:3000';
}

function getFallbackApiUrl() {
  // Get fallback URL from environment or use default Render URL
  if (typeof process !== 'undefined' && process.env && process.env.VET_CHATBOT_FALLBACK_URL) {
    return process.env.VET_CHATBOT_FALLBACK_URL;
  }
  return 'https://koko-h8y2.onrender.com';
}

/**
 * Try to fetch from primary URL, fallback to secondary URL if it fails
 */
async function fetchWithFallback(url, options, fallbackUrl) {
  try {
    const response = await fetch(url, options);
    // If successful, return response
    if (response.ok) {
      return response;
    }
    // If 4xx/5xx error and we have a fallback, try fallback
    if (fallbackUrl && url !== fallbackUrl) {
      console.log(`Primary API (${url}) returned error, trying fallback (${fallbackUrl})...`);
      return await fetch(fallbackUrl, options);
    }
    return response;
  } catch (error) {
    // Network error - try fallback if available
    if (fallbackUrl && url !== fallbackUrl) {
      console.log(`Primary API (${url}) unavailable, trying fallback (${fallbackUrl})...`);
      try {
        return await fetch(fallbackUrl, options);
      } catch (fallbackError) {
        // Both failed, throw original error
        throw error;
      }
    }
    throw error;
  }
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
    const apiUrl = getApiUrl();
    const fallbackUrl = getFallbackApiUrl();
    
    // Only use fallback if primary is localhost and different from fallback
    const useFallback = apiUrl.includes('localhost') && apiUrl !== fallbackUrl;
    
    const response = await fetchWithFallback(
      `${apiUrl}/api/chat/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          context,
        }),
      },
      useFallback ? `${fallbackUrl}/api/chat/message` : null
    );

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
    const apiUrl = getApiUrl();
    const fallbackUrl = getFallbackApiUrl();
    
    // Only use fallback if primary is localhost and different from fallback
    const useFallback = apiUrl.includes('localhost') && apiUrl !== fallbackUrl;
    
    const response = await fetchWithFallback(
      `${apiUrl}/api/appointments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...appointmentData,
        }),
      },
      useFallback ? `${fallbackUrl}/api/appointments` : null
    );

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
    const apiUrl = getApiUrl();
    const fallbackUrl = getFallbackApiUrl();
    
    // Only use fallback if primary is localhost and different from fallback
    const useFallback = apiUrl.includes('localhost') && apiUrl !== fallbackUrl;
    
    const response = await fetchWithFallback(
      `${apiUrl}/api/conversations/${sessionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      useFallback ? `${fallbackUrl}/api/conversations/${sessionId}` : null
    );

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

