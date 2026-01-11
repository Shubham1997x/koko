import React, { useState, useEffect } from 'react';

const AppointmentForm = ({
  bookingState,
  appointmentData,
  setAppointmentData,
  setBookingState,
  onSubmit,
  onCancel,
  config,
}) => {
  const [currentField, setCurrentField] = useState('');
  const [showFullForm, setShowFullForm] = useState(false);

  useEffect(() => {
    // Pre-fill from config if available
    if (config) {
      if (config.userName && !appointmentData.petOwnerName) {
        setAppointmentData((prev) => ({ ...prev, petOwnerName: config.userName }));
      }
      if (config.petName && !appointmentData.petName) {
        setAppointmentData((prev) => ({ ...prev, petName: config.petName }));
      }
    }

    // Initialize booking state
    if (bookingState === 'collecting_owner_name') {
      setShowFullForm(false);
    } else {
      setShowFullForm(true);
    }
  }, [bookingState, config]);

  const handleFieldSubmit = (value) => {
    if (!value.trim()) return;

    switch (bookingState) {
      case 'collecting_owner_name':
        setAppointmentData((prev) => ({ ...prev, petOwnerName: value.trim() }));
        setBookingState('collecting_pet_name');
        setCurrentField('');
        break;
      case 'collecting_pet_name':
        setAppointmentData((prev) => ({ ...prev, petName: value.trim() }));
        setBookingState('collecting_phone');
        setCurrentField('');
        break;
      case 'collecting_phone':
        setAppointmentData((prev) => ({ ...prev, phoneNumber: value.trim() }));
        setBookingState('collecting_date');
        setCurrentField('');
        break;
      case 'collecting_date':
        setAppointmentData((prev) => ({ ...prev, preferredDate: value.trim() }));
        setBookingState('confirming');
        setCurrentField('');
        setShowFullForm(true);
        break;
      default:
        break;
    }
  };

  const handleFullFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!appointmentData.petOwnerName.trim()) {
      alert('Please enter pet owner name');
      return;
    }
    if (!appointmentData.petName.trim()) {
      alert('Please enter pet name');
      return;
    }
    if (!appointmentData.phoneNumber.trim()) {
      alert('Please enter phone number');
      return;
    }
    if (!appointmentData.preferredDate) {
      alert('Please select a date');
      return;
    }

    onSubmit(appointmentData);
  };

  const getPrompt = () => {
    switch (bookingState) {
      case 'collecting_owner_name':
        return 'What is your name?';
      case 'collecting_pet_name':
        return 'What is your pet\'s name?';
      case 'collecting_phone':
        return 'What is your phone number?';
      case 'collecting_date':
        return 'What date would you prefer? (MM/DD/YYYY)';
      default:
        return '';
    }
  };

  if (showFullForm || bookingState === 'confirming') {
    return (
      <div className="vet-chatbot-appointment-form">
        <form onSubmit={handleFullFormSubmit}>
          <div className="vet-chatbot-form-group">
            <label className="vet-chatbot-form-label">Pet Owner Name</label>
            <input
              type="text"
              className="vet-chatbot-form-input"
              value={appointmentData.petOwnerName}
              onChange={(e) => setAppointmentData((prev) => ({ ...prev, petOwnerName: e.target.value }))}
              required
            />
          </div>
          <div className="vet-chatbot-form-group">
            <label className="vet-chatbot-form-label">Pet Name</label>
            <input
              type="text"
              className="vet-chatbot-form-input"
              value={appointmentData.petName}
              onChange={(e) => setAppointmentData((prev) => ({ ...prev, petName: e.target.value }))}
              required
            />
          </div>
          <div className="vet-chatbot-form-group">
            <label className="vet-chatbot-form-label">Phone Number</label>
            <input
              type="tel"
              className="vet-chatbot-form-input"
              value={appointmentData.phoneNumber}
              onChange={(e) => setAppointmentData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </div>
          <div className="vet-chatbot-form-group">
            <label className="vet-chatbot-form-label">Preferred Date & Time</label>
            <input
              type="datetime-local"
              className="vet-chatbot-form-input"
              value={appointmentData.preferredDate}
              onChange={(e) => setAppointmentData((prev) => ({ ...prev, preferredDate: e.target.value }))}
              required
            />
          </div>
          <div className="vet-chatbot-form-actions">
            <button
              type="button"
              className="vet-chatbot-form-button secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="vet-chatbot-form-button primary"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Conversational flow - one field at a time
  return (
    <div className="vet-chatbot-input-container">
      <div style={{ padding: '12px 16px', background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
          {getPrompt()}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentField.trim()) {
              handleFieldSubmit(currentField);
            }
          }}
          style={{ display: 'flex', gap: '8px' }}
        >
          <input
            type="text"
            className="vet-chatbot-input"
            value={currentField}
            onChange={(e) => setCurrentField(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
          />
          <button
            type="submit"
            className="vet-chatbot-send"
            disabled={!currentField.trim()}
          >
            Next
          </button>
        </form>
        <button
          onClick={() => setShowFullForm(true)}
          style={{
            marginTop: '8px',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Or fill all fields at once
        </button>
      </div>
    </div>
  );
};

export default AppointmentForm;

