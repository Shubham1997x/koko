import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import '../styles/chatbot.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="vet-chatbot-container">
        <button
          className="vet-chatbot-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="vet-chatbot-container">
      <div className="vet-chatbot-widget">
        <ChatInterface onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
};

export default ChatbotWidget;

