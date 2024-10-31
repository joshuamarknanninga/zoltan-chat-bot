// server/src/controllers/chatController.js

/**
 * Chat Controller
 * Handles incoming chat messages, performs sentiment analysis,
 * adjusts responses based on sentiment, and communicates with OpenAI API.
 */

const axios = require('axios');
const logger = require('../utils/logger');
const { analyzeSentiment } = require('../services/sentimentService');

/**
 * Handle incoming chat messages and respond using OpenAI API with sentiment-aware adjustments.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const handleChat = async (req, res, next) => {
  const { message } = req.body;

  // Input Validation
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    logger.warn('Invalid message received.');
    return res.status(400).json({ error: 'Invalid message provided.' });
  }

  try {
    // Perform Sentiment Analysis
    const sentimentResult = analyzeSentiment(message);
    const sentimentScore = sentimentResult.score;
    let sentimentLabel = 'neutral';

    // Determine sentiment label based on score thresholds
    if (sentimentScore > 2) {
      sentimentLabel = 'positive';
    } else if (sentimentScore < -2) {
      sentimentLabel = 'negative';
    }

    // Adjust system prompt based on sentiment
    let systemPrompt = 'You are Zoltan, a helpful and friendly chatbot.';
    if (sentimentLabel === 'positive') {
      systemPrompt += ' Respond in an enthusiastic and uplifting manner.';
    } else if (sentimentLabel === 'negative') {
      systemPrompt += ' Respond in a supportive and empathetic manner.';
    }

    // Prepare payload for OpenAI API
    const openAIParams = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    };

    // Communicate with OpenAI API
    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      openAIParams,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    // Extract bot message from OpenAI response
    const botMessage = openAIResponse.data.choices[0].message.content.trim();

    // Log successful interaction
    logger.info(`User Message: "${message}" | Sentiment: ${sentimentLabel} (${sentimentScore})`);
    logger.info(`Bot Reply: "${botMessage}"`);

    // Respond to client with bot reply and sentiment data
    res.status(200).json({
      reply: botMessage,
      sentiment: sentimentLabel,
      sentimentScore: sentimentScore,
    });
  } catch (error) {
    // Log error details
    if (error.response) {
      // OpenAI API responded with an error status
      logger.error(`OpenAI API Error: ${error.response.status} - ${error.response.data}`);
      res.status(502).json({ error: 'Failed to communicate with OpenAI API.' });
    } else if (error.request) {
      // No response received from OpenAI API
      logger.error('No response received from OpenAI API:', error.message);
      res.status(504).json({ error: 'No response from OpenAI API. Please try again later.' });
    } else {
      // Other errors
      logger.error('Unexpected Error:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

module.exports = { handleChat };
