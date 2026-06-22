import { createHash } from "crypto";
import { env } from "../../config/env.js";
import {
  changePassword as changePasswordService,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resendVerificationEmail as resendVerificationEmailService,
  resetPassword as resetPasswordService,
  verifyEmail as verifyEmailService,
} from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  clearAuthCookies,
  getRefreshTokenFromRequest,
  setRefreshCookie,
} from "../../utils/cookie.utils.js";
import { createdResponse, successResponse } from "../../utils/apiResponse.js";
import { logWarning } from "../../utils/logger.js";

function authResponseData(authData) {
  return {
    accessToken: authData.accessToken,
    user: authData.user,
  };
}

function setRotatedRefreshCookie(response, authData) {
  if (authData?.refreshToken) {
    setRefreshCookie(response, authData.refreshToken);
  }
}

function getAllowedClientBaseUrl(request) {
  const origin = request.get("origin");

  if (origin && env.clientUrls.includes(origin)) {
    return origin;
  }

  return env.clientUrls[0];
}

function hashAuditValue(value) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

function getAuthAuditContext(request, extra = {}) {
  return {
    ip: request.ip,
    method: request.method,
    path: request.originalUrl?.split("?")[0] ?? request.path,
    userAgent: String(request.get("user-agent") ?? "").slice(0, 160),
    ...extra,
  };
}

export const authStatus = (_request, response) =>
  successResponse(response, 200, "Auth module is ready.", {
    module: "auth",
    status: "ready",
  });

export const register = asyncHandler(async (request, response) => {
  const authData = await registerUser(request.body, {
    clientBaseUrl: getAllowedClientBaseUrl(request),
  });
  setRotatedRefreshCookie(response, authData);

  return createdResponse(response, "Account created successfully.", authResponseData(authData));
});

export const login = asyncHandler(async (request, response) => {
  let authData;

  try {
    authData = await loginUser(request.body);
  } catch (error) {
    logWarning("Failed login attempt", getAuthAuditContext(request, {
      emailHash: hashAuditValue(request.body?.email),
      statusCode: error.statusCode ?? error.status ?? 500,
    }));
    throw error;
  }

  setRotatedRefreshCookie(response, authData);
  return successResponse(response, 200, "Logged in successfully.", authResponseData(authData));
});

export const logout = asyncHandler(async (request, response) => {
  await logoutUser(getRefreshTokenFromRequest(request), request.user?.id);
  clearAuthCookies(response);

  return successResponse(response, 200, "Logged out successfully.", null);
});

export const refreshToken = asyncHandler(async (request, response) => {
  let authData;

  try {
    authData = await refreshAccessToken(getRefreshTokenFromRequest(request));
  } catch (error) {
    logWarning("Suspicious refresh token failure", getAuthAuditContext(request, {
      hasRefreshCookie: Boolean(getRefreshTokenFromRequest(request)),
      statusCode: error.statusCode ?? error.status ?? 500,
    }));
    throw error;
  }

  setRotatedRefreshCookie(response, authData);

  // The refresh token remains cookie-only. The safe user projection is kept
  // for the existing client session bootstrap contract.
  return successResponse(
    response,
    200,
    "Access token refreshed successfully.",
    authResponseData(authData),
  );
});

export const getMe = asyncHandler(async (request, response) => {
  const user = await getCurrentUser(request.user.id);

  return successResponse(response, 200, "Authenticated user fetched successfully.", { user });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  // TODO(email-provider): require a production email provider before enabling
  // account recovery in production. Raw reset tokens are never returned here.
  logWarning("Password reset requested", getAuthAuditContext(request, {
    emailHash: hashAuditValue(request.body?.email),
  }));
  await requestPasswordReset({
    clientBaseUrl: getAllowedClientBaseUrl(request),
    email: request.body.email,
  });

  return successResponse(
    response,
    200,
    "If an account exists with this email, password reset instructions will be sent.",
    null,
  );
});

export const resetPassword = asyncHandler(async (request, response) => {
  await resetPasswordService(request.body);
  clearAuthCookies(response);

  return successResponse(
    response,
    200,
    "Password reset successfully. Please log in again.",
    null,
  );
});

export const verifyEmail = asyncHandler(async (request, response) => {
  const result = await verifyEmailService(request.body);

  return successResponse(response, 200, "Email verified successfully.", {
    user: result.user,
  });
});

export const resendVerificationEmail = asyncHandler(async (request, response) => {
  // TODO(email-provider): replace skipped-development delivery with a
  // production email provider. Raw verification tokens are never returned.
  const result = await resendVerificationEmailService({
    clientBaseUrl: getAllowedClientBaseUrl(request),
    email: request.body.email,
  });

  return successResponse(
    response,
    200,
    result?.message ??
      "If an unverified account exists with this email, verification instructions will be sent.",
    result?.developmentEmail ? { developmentEmail: result.developmentEmail } : null,
  );
});

export const changePassword = asyncHandler(async (request, response) => {
  await changePasswordService(request.user.id, {
    currentPassword: request.body.currentPassword,
    newPassword: request.body.newPassword,
  });
  clearAuthCookies(response);

  return successResponse(
    response,
    200,
    "Password changed successfully. Please log in again.",
    null,
  );
});

export const refresh = refreshToken;
export const updatePasswordFromReset = resetPassword;
