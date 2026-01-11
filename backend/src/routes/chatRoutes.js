const express = require('express');
const router = express.Router();
const { handleMessage } = require('../controllers/chatController');

router.post('/message', handleMessage);

module.exports = router;

