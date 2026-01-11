/**
 * Generate or retrieve session ID
 * Uses localStorage to persist session across page reloads
 * @returns {string} Session ID
 */
export function getSessionId() {
  const STORAGE_KEY = 'vet_chatbot_session_id';
  
  // Try to get existing session ID from localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const existingSessionId = localStorage.getItem(STORAGE_KEY);
    if (existingSessionId) {
      return existingSessionId;
    }

    // Generate new session ID (simple UUID-like string)
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, newSessionId);
    return newSessionId;
  }

  // Fallback: generate session ID without localStorage
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

