const Conversation = require('../models/Conversation');

/**
 * Get conversation history
 * GET /api/conversations/:sessionId
 */
async function getConversation(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: 'sessionId is required',
      });
    }

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    res.json({
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      context: conversation.context,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

module.exports = {
  getConversation,
};

