// server/src/services/sentimentService.js

const Sentiment = require('sentiment');

const sentiment = new Sentiment();

/**
 * Analyze the sentiment of a given text.
 * @param {string} text - The text to analyze.
 * @returns {object} - The sentiment analysis result.
 */
const analyzeSentiment = (message) => {
  const result = sentiment.analyze(message);
  return result.score;
};

module.exports = {
  analyzeSentiment,
};