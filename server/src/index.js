// server/src/index.js

// Import Required Modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load Environment Variables from .env File
dotenv.config();

// Import Routes
const chatRoutes = require('./routes/chat');

// Initialize Express App
const app = express();

// Define Allowed Origins for CORS
const allowedOrigins = ['http://localhost:3000'];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies and authentication
};

// Apply Middlewares
app.use(cors(corsOptions)); // Enable CORS with the defined options
app.use(helmet()); // Set security-related HTTP headers
app.use(morgan('dev')); // Log HTTP requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Handle Preflight Requests
app.options('*', cors(corsOptions));

// Mount Routes
app.use('/api/chat', chatRoutes);

// Serve Static Files (Optional - Useful for Deployment)
// Uncomment the following lines if you plan to serve the frontend from the backend in production
/*
app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});
*/

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Define the Port
const PORT = process.env.PORT || 5001;

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
