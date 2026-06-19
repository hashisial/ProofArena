import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { logWarning } from "../utils/logger.js";

const DEFAULT_RATE_LIMIT_MESSAGE = "Too many requests. Please try again later.";

function environmentLimit({ development, production }) {
  return env.isProduction ? production : development;
}

function createRateLimiter({
  developmentLimit,
  productionLimit,
  limit,
  name = "rate-limit",
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
    handler(request, _response, next) {
      logWarning("Rate limit exceeded", {
        ip: request.ip,
        limiter: name,
        method: request.method,
        path: request.originalUrl?.split("?")[0] ?? request.path,
      });
      next(new AppError(message, 429, [], "RATE_LIMITED"));
    },
  });
}

export const apiRateLimiter = createRateLimiter({
  developmentLimit: 1000,
  name: "api-general",
  productionLimit: 300,
});

export const authGeneralRateLimiter = createRateLimiter({
  developmentLimit: 300,
  message: "Too many authentication requests. Please try again later.",
  name: "auth-general",
  productionLimit: 100,
  windowMs: 15 * 60 * 1000,
});

export const authStrictRateLimiter = createRateLimiter({
  developmentLimit: 50,
  message: "Too many attempts. Please wait and try again.",
  name: "auth-strict",
  productionLimit: 5,
  windowMs: 15 * 60 * 1000,
});

export const loginRateLimiter = createRateLimiter({
  developmentLimit: 50,
  message: "Too many login attempts. Please wait and try again.",
  name: "auth-login",
  productionLimit: 5,
  windowMs: 15 * 60 * 1000,
});

export const passwordResetRateLimiter = createRateLimiter({
  developmentLimit: 40,
  message: "Too many password reset requests. Please wait and try again.",
  name: "auth-password-reset",
  productionLimit: 5,
  windowMs: 15 * 60 * 1000,
});

export const resendVerificationRateLimiter = createRateLimiter({
  developmentLimit: 40,
  message: "Too many verification email requests. Please wait and try again.",
  name: "auth-resend-verification",
  productionLimit: 5,
  windowMs: 15 * 60 * 1000,
});

export const contactRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.contactRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler(request, _response, next) {
    logWarning("Rate limit exceeded", {
      ip: request.ip,
      limiter: "contact",
      method: request.method,
      path: request.originalUrl?.split("?")[0] ?? request.path,
    });
    next(new AppError(DEFAULT_RATE_LIMIT_MESSAGE, 429, [], "RATE_LIMITED"));
  },
});

export const uploadRateLimiter = createRateLimiter({
  developmentLimit: 100,
  name: "upload",
  productionLimit: 30,
  windowMs: 60 * 60 * 1000,
});

export const messageRateLimiter = createRateLimiter({
  developmentLimit: 500,
  name: "message",
  productionLimit: 100,
  windowMs: 15 * 60 * 1000,
});

export const challengeRateLimiter = createRateLimiter({
  developmentLimit: 100,
  name: "challenge",
  productionLimit: 20,
  windowMs: 60 * 60 * 1000,
});

export const connectionRateLimiter = createRateLimiter({
  limit: 60,
  name: "connection",
  windowMs: 15 * 60 * 1000,
});

export const authRateLimiter = authGeneralRateLimiter;
