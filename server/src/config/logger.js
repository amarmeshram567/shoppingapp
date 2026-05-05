import winston from "winston";

const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.printf(({ level, message, timestamp, stack }) =>
                `${timestamp} ${level}: ${stack || message}`
              )
            )
    })
  ]
});
