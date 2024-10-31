// server/src/utils/logger.js

const { createLogger, format, transports } = require('winston');

// Define custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: 'logs/server.log',
    handleExceptions: true,
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  },
};

// Instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// Create a stream object with a 'write' function that will be used by morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
