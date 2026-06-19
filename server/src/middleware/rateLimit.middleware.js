export {
  apiRateLimiter as generalLimiter,
  authGeneralRateLimiter,
  authRateLimiter,
  authRateLimiter as authLimiter,
  authStrictRateLimiter,
  challengeRateLimiter,
  challengeRateLimiter as challengeLimiter,
  connectionRateLimiter,
  loginRateLimiter,
  messageRateLimiter,
  messageRateLimiter as messageLimiter,
  passwordResetRateLimiter,
  resendVerificationRateLimiter,
  uploadRateLimiter as uploadLimiter,
} from "./rateLimitMiddleware.js";

export {
  apiRateLimiter,
  contactRateLimiter,
  uploadRateLimiter,
} from "./rateLimitMiddleware.js";
