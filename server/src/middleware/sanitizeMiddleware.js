const protectedBodyFields = new Set([
  "accessToken",
  "accountStatus",
  "adminNotes",
  "completedOutcomes",
  "emailVerified",
  "isAdmin",
  "isEmailVerified",
  "isSuspended",
  "passwordResetExpires",
  "passwordResetToken",
  "permissions",
  "platformFee",
  "proofScore",
  "ratingAverage",
  "refreshToken",
  "role",
  "totalReviews",
  "verificationStatus",
]);

const dangerousObjectKeys = new Set(["__proto__", "constructor", "prototype"]);

function getAllowedProtectedBodyFields(request) {
  const method = request.method?.toUpperCase();
  const path = request.originalUrl?.split("?")[0] ?? request.path ?? "";

  if (
    method === "POST" &&
    (path === "/api/v1/auth/register" || path === "/api/auth/register")
  ) {
    return new Set(["role"]);
  }

  return new Set();
}

function sanitizeString(value) {
  return value
    .trim()
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s{2,}/g, " ");
}

function shouldSkipObject(value) {
  return (
    !value ||
    value instanceof Date ||
    Buffer.isBuffer(value) ||
    (typeof value === "object" &&
      ("buffer" in value || "mimetype" in value || "originalname" in value))
  );
}

function sanitizeValue(value, options = {}) {
  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, options));
  }

  if (shouldSkipObject(value) || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((sanitized, [key, entryValue]) => {
    if (dangerousObjectKeys.has(key)) {
      return sanitized;
    }

    if (
      options.removeProtectedFields &&
      protectedBodyFields.has(key) &&
      !options.allowedProtectedFields?.has(key)
    ) {
      return sanitized;
    }

    sanitized[key] = sanitizeValue(entryValue, options);
    return sanitized;
  }, {});
}

export function sanitizeRequest(request, _response, next) {
  if (request.body && typeof request.body === "object") {
    request.body = sanitizeValue(request.body, {
      allowedProtectedFields: getAllowedProtectedBodyFields(request),
      removeProtectedFields: true,
    });
  }

  if (request.query && typeof request.query === "object") {
    try {
      request.query = sanitizeValue(request.query);
    } catch {
      // Some Express adapters expose query through a getter. Body and params
      // sanitization still cover write paths and route values.
    }
  }

  if (request.params && typeof request.params === "object") {
    request.params = sanitizeValue(request.params);
  }

  next();
}
