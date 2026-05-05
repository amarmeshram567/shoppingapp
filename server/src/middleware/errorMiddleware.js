import { logger } from "../config/logger.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const notFound = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = `Duplicate value for ${Object.keys(err.keyValue).join(", ")}`;
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  logger.error(`${req.method} ${req.originalUrl} - ${message}`);

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
