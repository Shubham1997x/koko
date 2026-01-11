const Conversation = require('../models/Conversation');
const { generateResponse } = require('../services/geminiService');
const { detectAppointmentIntent } = require('../services/appointmentService');

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
    } else {
      // Update context if new context is provided
      if (context && Object.keys(context).length > 0) {
        conversation.context = { ...conversation.context, ...context };
      }
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
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'I apologize, but I\'m having trouble processing your request right now.';
      
      if (error.message && error.message.includes('API key')) {
        errorMessage = 'The AI service is not properly configured. Please contact support.';
        console.error('Configuration error: API key issue');
      } else if (error.message && error.message.includes('MODEL_NOT_FOUND')) {
        errorMessage = 'The AI model is not available. Please contact support.';
        console.error('Configuration error: Model not found');
      } else {
        console.error('Full error details:', JSON.stringify(error, null, 2));
      }
      
      aiResponse = errorMessage + ' Please try again in a moment.';
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

