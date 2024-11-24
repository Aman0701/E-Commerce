

import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

// Define a custom format for log messages
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance with two separate file transports
const logger = createLogger({
  level: 'info', // Default level
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.File({ filename: 'combined.log' }), // Log all activity
    new transports.File({ filename: 'error.log', level: 'error' }) // Log errors separately
  ],
});

export default logger;
