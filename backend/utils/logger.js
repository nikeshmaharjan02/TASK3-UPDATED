const winston = require("winston");

const logger = winston.createLogger({
    level: "info", 
    format: winston.format.combine(
        winston.format.timestamp(), // Adds timestamp to logs
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Logs to the console
        new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Logs errors to a file
        new winston.transports.File({ filename: "logs/combined.log" }) // Logs all messages to a file
    ]
});

module.exports = logger;
