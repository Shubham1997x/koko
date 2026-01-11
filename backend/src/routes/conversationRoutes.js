const express = require('express');
const router = express.Router();
const { getConversation } = require('../controllers/conversationController');

router.get('/:sessionId', getConversation);

module.exports = router;

