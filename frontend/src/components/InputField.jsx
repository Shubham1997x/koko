import React, { useState, useRef, useEffect } from 'react';

const InputField = ({ onSend, disabled, placeholder = "Type your message..." }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="vet-chatbot-input-container" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="vet-chatbot-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="submit"
        className="vet-chatbot-send"
        disabled={disabled || !input.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default InputField;

