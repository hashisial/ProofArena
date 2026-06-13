import { sanitizeInput } from "../utils/sanitizeInput.js";

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

export function sanitizeRequest(request, _response, next) {
  if (request.body && typeof request.body === "object") {
    request.body = sanitizeInput(request.body, {
      allowedRemovedKeys: getAllowedProtectedBodyFields(request),
      removeKeys: protectedBodyFields,
    });
  }

  if (request.query && typeof request.query === "object") {
    try {
      request.query = sanitizeInput(request.query);
    } catch {
      // Some Express adapters expose query through a getter. Body and params
      // sanitization still cover write paths and route values.
    }
  }

  if (request.params && typeof request.params === "object") {
    request.params = sanitizeInput(request.params);
  }

  next();
}
