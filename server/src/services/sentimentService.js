// server/src/services/sentimentService.js

const Sentiment = require('sentiment');

const sentiment = new Sentiment();

/**
 * Analyze the sentiment of a given text.
 * @param {string} text - The text to analyze.
 * @returns {object} - The sentiment analysis result.
 */
const analyzeSentiment = (text) => {
  return sentiment.analyze(text);
};

module.exports = { analyzeSentiment };
