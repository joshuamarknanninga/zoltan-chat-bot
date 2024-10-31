// server/src/controllers/chatController.js

/**
 * Chat Controller
 * 
 * This controller handles incoming chat messages from the client,
 * analyzes the sentiment of the message, generates an appropriate
 * response based on the sentiment, and sends the response back to the client.
 * 
 * Dependencies:
 * - sentimentService: For analyzing the sentiment of the message.
 * - responseService: For generating responses based on sentiment.
 * - winston: For logging errors and information.
 */

const { analyzeSentiment } = require('../services/sentimentService');
const { generateResponse } = require('../services/responseService');
const logger = require('../utils/logger');

/**
 * Handle Chat Request
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * Expects:
 * - req.body.message: The chat message sent by the client.
 * 
 * Responses:
 * - 200: Successful response with generated reply.
 * - 400: Bad request if message is missing.
 * - 500: Internal server error for unexpected issues.
 */
const handleChat = async (req, res) => {
  try {
    // Extract the message from the request body
    const { message } = req.body;

    // Validate the presence of the message
    if (!message || typeof message !== 'string') {
      logger.warn('Chat request received without a valid message.');
      return res.status(400).json({
        success: false,
        message: 'Invalid request: "message" is required and must be a string.',
      });
    }

    // Log the incoming message
    logger.info(`Received message: "${message}"`);

    // Analyze the sentiment of the message
    const sentimentScore = analyzeSentiment(message);
    logger.info(`Sentiment score: ${sentimentScore}`);

    // Generate a response based on the sentiment score
    const reply = generateResponse(sentimentScore);
    logger.info(`Generated reply: "${reply}"`);

    // Send the response back to the client
    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    // Log the error with stack trace for debugging
    logger.error('Error handling chat request:', error);

    // Send a generic error response to the client
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again later.',
    });
  }
};

module.exports = {
  handleChat,
};
