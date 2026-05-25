import { env } from "../config/env.js";
import {
  changePassword as changePasswordService,
  generatePasswordResetToken,
  getCurrentUser,
  loginUser,
  refreshUserToken,
  registerUser,
  requestEmailVerification,
  revokeRefreshSession,
  resetPasswordWithToken,
  verifyEmailWithToken,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  clearAuthCookies,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
} from "../utils/cookie.utils.js";
import { createdResponse, successResponse } from "../utils/apiResponse.js";

function authResponseData(authData) {
  return {
    accessToken: authData.accessToken,
    user: authData.user,
  };
}

function setRotatedRefreshCookie(response, authData) {
  if (authData?.refreshToken) {
    setRefreshTokenCookie(response, authData.refreshToken);
  }
}

function getAllowedClientBaseUrl(request) {
  const origin = request.get("origin");

  if (origin && env.clientUrls.includes(origin)) {
    return origin;
  }

  return env.clientUrls[0];
}

export const authStatus = (_request, response) =>
  successResponse(response, 200, "Auth module is ready", {
    module: "auth",
    status: "ready",
  });

export const register = asyncHandler(async (request, response) => {
  const authData = await registerUser(request.body);
  setRotatedRefreshCookie(response, authData);

  return createdResponse(response, "Account created successfully", authResponseData(authData));
});

export const login = asyncHandler(async (request, response) => {
  const authData = await loginUser(request.body);
  setRotatedRefreshCookie(response, authData);

  return successResponse(response, 200, "Logged in successfully", authResponseData(authData));
});

export const logout = asyncHandler(async (request, response) => {
  await revokeRefreshSession(getRefreshTokenFromCookie(request));
  clearAuthCookies(response);

  return successResponse(response, 200, "Logged out successfully", null);
});

export const refreshToken = asyncHandler(async (request, response) => {
  const refreshCookie = getRefreshTokenFromCookie(request);
  const authData = await refreshUserToken(refreshCookie);
  setRotatedRefreshCookie(response, authData);

  return successResponse(response, 200, "Token refreshed successfully", authResponseData(authData));
});

export const getMe = asyncHandler(async (request, response) => {
  const user = await getCurrentUser(request.user.id);

  return successResponse(response, 200, "Current user fetched successfully", { user });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  const tokenResult = await generatePasswordResetToken(request.body.email);
  const data = !env.isProduction && tokenResult?.token
    ? { resetToken: tokenResult.token }
    : null;

  return successResponse(
    response,
    200,
    "If an account exists with this email, password reset instructions will be sent.",
    data,
  );
});

export const resetPassword = asyncHandler(async (request, response) => {
  await resetPasswordWithToken(request.body.token, request.body.password);
  clearAuthCookies(response);

  return successResponse(response, 200, "Password reset successfully. Please log in again.", null);
});

export const verifyEmail = asyncHandler(async (request, response) => {
  const user = await verifyEmailWithToken(request.body.token);

  return successResponse(response, 200, "Email verified successfully", { user });
});

export const resendVerificationEmail = asyncHandler(async (request, response) => {
  const verificationResult = await requestEmailVerification({
    clientBaseUrl: getAllowedClientBaseUrl(request),
    email: request.body.email,
  });
  const data = !env.isProduction && verificationResult?.verificationToken
    ? {
        verificationToken: verificationResult.verificationToken,
        verificationUrl: verificationResult.verificationUrl,
      }
    : null;

  return successResponse(
    response,
    200,
    "If an unverified account exists with this email, verification instructions will be sent.",
    data,
  );
});

export const changePassword = asyncHandler(async (request, response) => {
  await changePasswordService(request.user.id, {
    currentPassword: request.body.currentPassword,
    newPassword: request.body.newPassword,
  });
  clearRefreshTokenCookie(response);

  return successResponse(response, 200, "Password changed successfully. Please log in again.", null);
});

export const refresh = refreshToken;
export const updatePasswordFromReset = resetPassword;
