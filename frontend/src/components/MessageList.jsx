import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="vet-chatbot-messages">
      {messages.length === 0 && (
        <div className="vet-chatbot-message assistant">
          <div className="vet-chatbot-message-bubble">
            Hello! I'm your veterinary assistant. How can I help you and your pet today?
          </div>
        </div>
      )}
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

