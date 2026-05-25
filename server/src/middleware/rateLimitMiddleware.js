import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const DEFAULT_RATE_LIMIT_MESSAGE = "Too many requests. Please try again later.";

function environmentLimit({ development, production }) {
  return env.isProduction ? production : development;
}

function createRateLimiter({
  developmentLimit,
  productionLimit,
  limit,
  message = DEFAULT_RATE_LIMIT_MESSAGE,
  windowMs = env.rateLimitWindowMs,
}) {
  return rateLimit({
    windowMs,
    limit: limit ?? environmentLimit({
      development: developmentLimit,
      production: productionLimit,
    }),
    standardHeaders: true,
    legacyHeaders: false,
    handler(_request, _response, next) {
      next(new AppError(message, 429));
    },
  });
}

export const apiRateLimiter = createRateLimiter({
  developmentLimit: 1000,
  productionLimit: 300,
});

export const authRateLimiter = createRateLimiter({
  developmentLimit: 100,
  productionLimit: 10,
  windowMs: 15 * 60 * 1000,
});

export const contactRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.contactRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_request, _response, next) {
    next(new AppError(DEFAULT_RATE_LIMIT_MESSAGE, 429));
  },
});

export const uploadRateLimiter = createRateLimiter({
  developmentLimit: 100,
  productionLimit: 30,
  windowMs: 60 * 60 * 1000,
});

export const messageRateLimiter = createRateLimiter({
  developmentLimit: 500,
  productionLimit: 100,
  windowMs: 15 * 60 * 1000,
});

export const challengeRateLimiter = createRateLimiter({
  developmentLimit: 100,
  productionLimit: 20,
  windowMs: 60 * 60 * 1000,
});

export const connectionRateLimiter = createRateLimiter({
  limit: 60,
  windowMs: 15 * 60 * 1000,
});
