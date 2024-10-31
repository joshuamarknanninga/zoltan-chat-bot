// server/src/routes/chat.js

const express = require('express');
const router = express.Router();

// Import Chat Controller
const { handleChat } = require('../controllers/chatController');

// POST /api/chat
router.post('/', handleChat);

module.exports = router;
