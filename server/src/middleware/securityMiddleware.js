import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { env } from "../config/env.js";

export const generalRateLimit = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }

  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }

  if (req.query) {
    mongoSanitize.sanitize(req.query);
  }

  next();
};

export const applySecurityMiddleware = (app) => {
  app.use(generalRateLimit);
  app.use(sanitizeRequest);
  app.use(hpp());
};
