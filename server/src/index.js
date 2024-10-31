// server/src/index.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Zoltan Chatbot Server is running.' });
});

// Error Handling Middleware
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
