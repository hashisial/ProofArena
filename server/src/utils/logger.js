import { env } from "../config/env.js";

const sensitiveKeys = new Set([
  "apiKey",
  "api_key",
  "accessToken",
  "authorization",
  "cookie",
  "cookies",
  "jwt",
  "jwtAccessSecret",
  "jwtRefreshSecret",
  "mongoUri",
  "password",
  "passwordResetToken",
  "refreshToken",
  "secret",
  "token",
  "uri",
].map((key) => key.toLowerCase()));

function isSensitiveKey(key) {
  const normalizedKey = String(key ?? "").toLowerCase();

  return (
    sensitiveKeys.has(normalizedKey) ||
    normalizedKey.includes("authorization") ||
    normalizedKey.includes("cookie") ||
    normalizedKey.includes("password") ||
    normalizedKey.includes("secret") ||
    normalizedKey.includes("token")
  );
}

export function sanitizeLogData(data) {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item));
  }

  return Object.entries(data).reduce((sanitized, [key, value]) => {
    if (isSensitiveKey(key)) {
      sanitized[key] = "[REDACTED]";
      return sanitized;
    }

    sanitized[key] = sanitizeLogData(value);
    return sanitized;
  }, {});
}

export function logError(error, request, statusCode) {
  if (env.nodeEnv === "test") {
    return;
  }

  const payload = {
    level: "error",
    timestamp: new Date().toISOString(),
    statusCode,
    method: request.method,
    path: request.originalUrl,
    message: error.message || "Server Error",
  };

  if (!env.isProduction && error.stack) {
    payload.stack = error.stack;
  }

  console.error(JSON.stringify(payload));
}

export function logInfo(message, details = {}) {
  if (env.nodeEnv === "test") {
    return;
  }

  console.log(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message,
      ...sanitizeLogData(details),
    }),
  );
}

export function logWarning(message, details = {}) {
  if (env.nodeEnv === "test") {
    return;
  }

  console.warn(
    JSON.stringify({
      level: "warn",
      timestamp: new Date().toISOString(),
      message,
      ...sanitizeLogData(details),
    }),
  );
}

export const logger = {
  debug(message, details = {}) {
    if (!env.isProduction) {
      logInfo(message, { debug: true, ...details });
    }
  },
  error(message, details = {}) {
    if (env.nodeEnv === "test") {
      return;
    }

    console.error(
      JSON.stringify({
        level: "error",
        message,
        timestamp: new Date().toISOString(),
        ...sanitizeLogData(details),
      }),
    );
  },
  info: logInfo,
  warn: logWarning,
};
