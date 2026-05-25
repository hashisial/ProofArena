import { Router } from "express";
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
} from "../../controllers/auth.controller.js";
import { USER_ROLES } from "../../constants/index.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimitMiddleware.js";
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
} from "../../validators/auth.validator.js";
import { successResponse } from "../../utils/apiResponse.js";

const router = Router();

router.get("/status", authStatus);

router.post("/register", authRateLimiter, validateBody(registerSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.post("/logout", validateBody(logoutSchema), logout);
router.post(
  "/refresh-token",
  validateBody(refreshTokenSchema),
  refreshToken,
);
router.post("/refresh", validateBody(refreshTokenSchema), refreshToken);
router.get("/me", authenticate, getMe);
router.post(
  "/forgot-password",
  authRateLimiter,
  validateBody(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  authRateLimiter,
  validateBody(resetPasswordSchema),
  resetPassword,
);
router.post(
  "/verify-email",
  authRateLimiter,
  validateBody(verifyEmailSchema),
  verifyEmail,
);
router.post(
  "/resend-verification",
  authRateLimiter,
  validateBody(resendVerificationSchema),
  resendVerificationEmail,
);
router.post(
  "/change-password",
  authenticate,
  authRateLimiter,
  validateBody(changePasswordSchema),
  changePassword,
);

router.get("/protected-status", authenticate, (request, response) =>
  successResponse(response, 200, "Protected auth route is working", {
    role: request.user.role,
    userId: request.user.id,
  }),
);

router.get(
  "/admin-status",
  authenticate,
  authorizeRoles(USER_ROLES.ADMIN),
  (_request, response) =>
    successResponse(response, 200, "Admin auth route is working", {
      module: "auth",
      role: USER_ROLES.ADMIN,
    }),
);

export default router;
