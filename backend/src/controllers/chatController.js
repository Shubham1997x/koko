const Conversation = require('../models/Conversation');
const { generateResponse } = require('../services/geminiService');
const { detectAppointmentIntent, BOOKING_STATES } = require('../services/appointmentService');

/**
 * Handle chat message
 * POST /api/chat/message
 */
async function handleMessage(req, res) {
  try {
    const { sessionId, message, context } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        error: 'sessionId and message are required',
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        messages: [],
        context: context || {},
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message,
    });

    // Check for appointment intent
    const hasAppointmentIntent = detectAppointmentIntent(message);

    // Generate AI response
    let aiResponse;
    try {
      // Convert messages to format expected by Gemini
      const conversationHistory = conversation.messages.slice(0, -1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      aiResponse = await generateResponse(message, conversationHistory);

      // If appointment intent detected, append booking prompt
      if (hasAppointmentIntent) {
        aiResponse += '\n\nI can help you book an appointment! I\'ll need a few details. What is your name?';
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      aiResponse = 'I apologize, but I\'m having trouble processing your request right now. Please try again.';
    }

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
    });

    // Save conversation
    await conversation.save();

    res.json({
      sessionId,
      response: aiResponse,
      hasAppointmentIntent,
    });
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

module.exports = {
  handleMessage,
};

