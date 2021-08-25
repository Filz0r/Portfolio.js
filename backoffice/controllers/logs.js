const fs = require("fs");
const path = require("path");
const winston = require("winston");

const logFile = path.join("./logs", "/logs.log");
const errorFile = path.join("./logs", "/error.log");
const exceptionsFile = path.join("./logs", "/exceptions.log");

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: winston.format.combine(
    winston.format.timestamp({
      format: "HH:mm:ss DD-MM-YYYY ",
    }),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: `${errorFile}`, level: "error" }),
    new winston.transports.File({ filename: `${logFile}` }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
module.exports = { logger };
