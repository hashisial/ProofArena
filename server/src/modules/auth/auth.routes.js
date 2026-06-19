import { Router } from "express";
import { USER_ROLES } from "../../constants/index.js";
import {
  authStatus,
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "./auth.controller.js";
import { optionalAuth, protect } from "../../middleware/auth.middleware.js";
import {
  authGeneralRateLimiter,
  authStrictRateLimiter,
  loginRateLimiter,
  passwordResetRateLimiter,
  resendVerificationRateLimiter,
} from "../../middleware/rateLimitMiddleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validators.js";
import { successResponse } from "../../utils/apiResponse.js";

const router = Router();

router.use(authGeneralRateLimiter);
router.get("/status", authStatus);

router.post("/register", validateBody(registerSchema), register);
// TODO(auth-rate-limit): add user/email-based throttling after auth event
// storage exists. Current protection is intentionally IP-based.
router.post("/login", loginRateLimiter, validateBody(loginSchema), login);
router.post("/logout", optionalAuth, validateBody(logoutSchema), logout);
router.post("/refresh", validateBody(refreshTokenSchema), refreshToken);
router.post("/refresh-token", validateBody(refreshTokenSchema), refreshToken);
router.get("/me", protect, getMe);
// TODO(auth-rate-limit): add email-hash throttling for password recovery.
router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  validateBody(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  authStrictRateLimiter,
  validateBody(resetPasswordSchema),
  resetPassword,
);
router.post(
  "/verify-email",
  authStrictRateLimiter,
  validateBody(verifyEmailSchema),
  verifyEmail,
);
router.post(
  "/resend-verification",
  resendVerificationRateLimiter,
  validateBody(resendVerificationSchema),
  resendVerificationEmail,
);
router.post(
  "/change-password",
  protect,
  authStrictRateLimiter,
  validateBody(changePasswordSchema),
  changePassword,
);

router.get("/protected-status", protect, (request, response) =>
  successResponse(response, 200, "Protected auth route is working.", {
    role: request.user.role,
    userId: request.user.id,
  }),
);

router.get(
  "/admin-status",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  (_request, response) =>
    successResponse(response, 200, "Admin auth route is working.", {
      module: "auth",
      role: USER_ROLES.ADMIN,
    }),
);

export default router;
