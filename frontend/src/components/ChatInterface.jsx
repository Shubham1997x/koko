import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputField from './InputField';
import { sendMessage, createAppointment, getConversation } from '../services/apiService';
import { getSessionId } from '../utils/sessionManager';
import { readConfig } from '../utils/configReader';
import AppointmentForm from './AppointmentForm';

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState(null);
  const [bookingState, setBookingState] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    petOwnerName: '',
    petName: '',
    phoneNumber: '',
    preferredDate: '',
  });

  useEffect(() => {
    // Initialize session and config
    const session = getSessionId();
    const userConfig = readConfig();
    setSessionId(session);
    setConfig(userConfig);

    // Load conversation history if session exists
    if (session) {
      loadConversationHistory(session);
    }
  }, []);

  const loadConversationHistory = async (sessionId) => {
    try {
      const conversation = await getConversation(sessionId);
      if (conversation && conversation.messages && conversation.messages.length > 0) {
        setMessages(conversation.messages);
      }
    } catch (error) {
      // Silently fail if conversation doesn't exist (expected for new sessions)
      console.log('No previous conversation found or error loading:', error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!sessionId) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const context = config ? {
        userId: config.userId,
        userName: config.userName,
        petName: config.petName,
        source: config.source,
      } : {};

      const response = await sendMessage(sessionId, text, context);

      const assistantMessage = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, assistantMessage]);

      // Check if appointment intent detected
      if (response.hasAppointmentIntent && !bookingState) {
        setBookingState('collecting_owner_name');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentSubmit = async (data) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await createAppointment(sessionId, data);
      
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: `Great! Your appointment has been booked successfully. We'll see you and ${data.petName} on ${new Date(data.preferredDate).toLocaleDateString()}. Is there anything else I can help you with?`,
      }]);

      setBookingState(null);
      setAppointmentData({
        petOwnerName: '',
        petName: '',
        phoneNumber: '',
        preferredDate: '',
      });
    } catch (err) {
      // Extract validation errors if available
      const errorMessage = err.message || 'Failed to book appointment. Please try again.';
      const errorDetails = err.response?.errors || [];
      const fullError = errorDetails.length > 0 
        ? `${errorMessage}: ${errorDetails.join(', ')}`
        : errorMessage;
      setError(fullError);
      console.error('Error booking appointment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setBookingState(null);
    setAppointmentData({
      petOwnerName: '',
      petName: '',
      phoneNumber: '',
      preferredDate: '',
    });
  };

  return (
    <>
      <div className="vet-chatbot-header">
        <h3>Veterinary Assistant</h3>
        <button
          className="vet-chatbot-close"
          onClick={onClose || (() => window.location.reload())}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      {error && <div className="vet-chatbot-error">{error}</div>}
      <MessageList messages={messages} isLoading={isLoading} />
      {bookingState ? (
        <AppointmentForm
          bookingState={bookingState}
          appointmentData={appointmentData}
          setAppointmentData={setAppointmentData}
          setBookingState={setBookingState}
          onSubmit={handleAppointmentSubmit}
          onCancel={handleCancelBooking}
          config={config}
        />
      ) : (
        <InputField onSend={handleSendMessage} disabled={isLoading} />
      )}
    </>
  );
};

export default ChatInterface;

