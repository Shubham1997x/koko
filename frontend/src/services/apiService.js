/**
 * API Service for communicating with backend
 * API URL can be configured via window.VetChatbotConfig.apiUrl
 * Automatically falls back to Render backend if local backend is unavailable
 */

function getApiUrl() {
  try {
    // Priority 1: User-provided config (highest priority)
    if (typeof window !== 'undefined' && window.VetChatbotConfig && window.VetChatbotConfig.apiUrl) {
      const url = window.VetChatbotConfig.apiUrl;
      if (url && url !== 'undefined' && url !== 'null' && url.trim()) {
        console.log('Using API URL from VetChatbotConfig:', url);
        return url.trim();
      }
    }
    
    // Priority 2: Runtime detection - check if we're in production (not localhost)
    // This is more reliable than build-time variables
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
      
      if (!isLocalhost) {
        // In production (deployed on Vercel or any other domain), use Render backend
        const productionUrl = 'https://koko-h8y2.onrender.com';
        console.log('Detected production environment (hostname:', hostname, '), using Render backend:', productionUrl);
        return productionUrl;
      }
    }
    
    // Priority 3: Environment variable (set at build time by webpack)
    // Only use if it's not localhost (to avoid build-time issues)
    if (typeof process !== 'undefined' && process.env && process.env.VET_CHATBOT_API_URL) {
      const envApiUrl = process.env.VET_CHATBOT_API_URL;
      if (envApiUrl && envApiUrl !== 'undefined' && envApiUrl !== 'null' && envApiUrl.trim()) {
        const trimmedUrl = envApiUrl.trim();
        // Don't use localhost from env var if we're in production
        if (!trimmedUrl.includes('localhost')) {
          console.log('Using API URL from environment variable:', trimmedUrl);
          return trimmedUrl;
        }
      }
    }
    
    // Default to localhost for local development
    const localhostUrl = 'http://localhost:3000';
    console.log('Using default localhost API URL:', localhostUrl);
    return localhostUrl;
  } catch (error) {
    console.error('Error determining API URL:', error);
    // Fallback to Render backend if there's any error
    return 'https://koko-h8y2.onrender.com';
  }
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
  // Validate inputs
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }

  try {
    const apiUrl = getApiUrl();
    const fallbackUrl = getFallbackApiUrl();
    
    // Validate API URL
    if (!apiUrl || apiUrl === 'undefined' || apiUrl === 'null') {
      throw new Error('API URL is not configured. Please check your environment variables.');
    }
    
    console.log('Sending message to:', apiUrl);
    console.log('Fallback URL:', fallbackUrl);
    console.log('Request payload:', { sessionId, message, context });
    
    // Use fallback if primary is localhost and different from fallback
    const useFallback = apiUrl.includes('localhost') && apiUrl !== fallbackUrl;
    
    const requestUrl = `${apiUrl}/api/chat/message`;
    console.log('Making request to:', requestUrl);
    
    const response = await fetchWithFallback(
      requestUrl,
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
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText || 'Failed to send message' };
      }
      console.error('API Error Response:', errorData);
      throw new Error(errorData.error || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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

