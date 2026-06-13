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

const configuredSecretValues = [
  env.adminPassword,
  env.cloudinaryApiSecret,
  env.emailPass,
  env.jwtAccessSecret,
  env.jwtRefreshSecret,
  env.mongoUri,
  env.openAiApiKey,
  env.redisUrl,
  env.stripeSecretKey,
  env.stripeWebhookSecret,
].filter((value) => typeof value === "string" && value.length >= 8);

export function sanitizeLogMessage(value) {
  let message = String(value ?? "");

  for (const secretValue of configuredSecretValues) {
    message = message.replaceAll(secretValue, "[REDACTED]");
  }

  return message
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/(mongodb(?:\+srv)?:\/\/)[^@\s]+@/gi, "$1[REDACTED]@")
    .replace(
      /((?:api[_-]?key|authorization|cookie|password|secret|token)\s*[:=]\s*)[^\s,;]+/gi,
      "$1[REDACTED]",
    );
}

export function sanitizeLogData(data, seen = new WeakSet()) {
  if (typeof data === "string") {
    return sanitizeLogMessage(data);
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  if (seen.has(data)) {
    return "[Circular]";
  }

  seen.add(data);

  if (data instanceof Error) {
    return {
      message: sanitizeLogMessage(data.message),
      name: data.name,
      ...(!env.isProduction && data.stack
        ? { stack: sanitizeLogMessage(data.stack) }
        : {}),
    };
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item, seen));
  }

  return Object.entries(data).reduce((sanitized, [key, value]) => {
    if (isSensitiveKey(key)) {
      sanitized[key] = "[REDACTED]";
      return sanitized;
    }

    sanitized[key] = sanitizeLogData(value, seen);
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
    path: sanitizeLogMessage(request.originalUrl),
    message: sanitizeLogMessage(error.message || "Server Error"),
  };

  if (!env.isProduction && error.stack) {
    payload.stack = sanitizeLogMessage(error.stack);
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
      message: sanitizeLogMessage(message),
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
      message: sanitizeLogMessage(message),
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
        message: sanitizeLogMessage(message),
        timestamp: new Date().toISOString(),
        ...sanitizeLogData(details),
      }),
    );
  },
  info: logInfo,
  warn: logWarning,
};
