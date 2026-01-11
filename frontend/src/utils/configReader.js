/**
 * Read configuration from window.VetChatbotConfig
 * @returns {Object} Configuration object
 */
export function readConfig() {
  if (typeof window !== 'undefined' && window.VetChatbotConfig) {
    return {
      userId: window.VetChatbotConfig.userId || null,
      userName: window.VetChatbotConfig.userName || null,
      petName: window.VetChatbotConfig.petName || null,
      source: window.VetChatbotConfig.source || null,
    };
  }
  return {
    userId: null,
    userName: null,
    petName: null,
    source: null,
  };
}

