// server/src/routes/chat.js

const express = require('express');
const { handleChat } = require('../controllers/chatController');

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Handle chat messages and respond using OpenAI API
 * @access Public
 */
router.post('/', handleChat);

module.exports = router;
