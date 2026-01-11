import React from 'react';

const MessageBubble = ({ message }) => {
  return (
    <div className={`vet-chatbot-message ${message.role}`}>
      <div className="vet-chatbot-message-bubble">
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;

