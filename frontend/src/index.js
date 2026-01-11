import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget';

/**
 * Initialize and render the chatbot widget
 * This function is called automatically when the script is loaded
 */
function initChatbot() {
  // Check if widget already exists to prevent duplicates
  const existingWidget = document.getElementById('vet-chatbot-root');
  if (existingWidget) {
    console.warn('Veterinary Chatbot widget is already initialized');
    return;
  }

  // Create root container for the widget
  const widgetRoot = document.createElement('div');
  widgetRoot.id = 'vet-chatbot-root';
  document.body.appendChild(widgetRoot);

  // Render the React component
  const root = createRoot(widgetRoot);
  root.render(
    <React.StrictMode>
      <ChatbotWidget />
    </React.StrictMode>
  );
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  // DOM is already ready
  initChatbot();
}

// Export for manual initialization if needed
if (typeof window !== 'undefined') {
  window.VetChatbot = {
    init: initChatbot,
  };
}

