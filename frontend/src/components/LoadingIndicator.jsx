import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="vet-chatbot-message assistant">
      <div className="vet-chatbot-loading">
        <div className="vet-chatbot-loading-dot"></div>
        <div className="vet-chatbot-loading-dot"></div>
        <div className="vet-chatbot-loading-dot"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;

