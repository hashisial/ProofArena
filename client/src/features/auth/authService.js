import { AUTH_API } from "../../constants/index.js";
import { normalizeApiError } from "../../services/apiClient.js";
import { api } from "../../services/apiClient.js";

const safeAuthUserFields = Object.freeze([
  "accountStatus",
  "accountType",
  "avatar",
  "createdAt",
  "email",
  "emailVerified",
  "fullName",
  "id",
  "isEmailVerified",
  "isSuspended",
  "isVerified",
  "lastLogin",
  "lastLoginAt",
  "name",
  "onboardingCompleted",
  "permissions",
  "profileId",
  "role",
  "subscriptionId",
  "updatedAt",
  "username",
  "verificationStatus",
]);

function normalizeRegisterPayload(payload = {}) {
  return {
    ...payload,
    fullName: payload.fullName ?? payload.name ?? "",
    role: payload.role,
  };
}

function normalizeEmailPayload(payload) {
  if (typeof payload === "string") {
    return { email: payload };
  }

  return payload ?? {};
}

function normalizeTokenPayload(payload) {
  if (typeof payload === "string") {
    return { token: payload };
  }

  return payload ?? {};
}

export function mapAuthUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  return safeAuthUserFields.reduce((safeUser, field) => {
    if (user[field] !== undefined) {
      safeUser[field] = user[field];
    }

    return safeUser;
  }, {});
}

export function mapAuthResponse(response = {}) {
  const source = response ?? {};
  const accessToken = source.accessToken ?? source.token ?? "";

  return {
    accessToken,
    token: accessToken,
    user: mapAuthUser(source.user),
  };
}

function mapCurrentUserResponse(response = {}) {
  const source = response ?? {};

  return {
    user: mapAuthUser(source.user ?? source),
  };
}

function mapActionResponse(response = {}) {
  const source = response ?? {};

  return {
    data: source.data ?? null,
    message: source.message ?? "",
    success: source.success ?? true,
  };
}

async function executeAuthRequest(request, mapper = (response) => response) {
  try {
    return mapper(await request);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

function requestAccessTokenRefresh() {
  return executeAuthRequest(api.post(AUTH_API.REFRESH, {}), mapAuthResponse);
}

export const authService = Object.freeze({
  changePassword(payload = {}) {
    return executeAuthRequest(
      api.post(AUTH_API.CHANGE_PASSWORD, {
        ...payload,
        confirmNewPassword: payload.confirmNewPassword ?? payload.newPassword,
      }),
      mapActionResponse,
    );
  },
  forgotPassword(payload) {
    return executeAuthRequest(
      api.post(AUTH_API.FORGOT_PASSWORD, normalizeEmailPayload(payload)),
      mapActionResponse,
    );
  },
  getCurrentUser() {
    return executeAuthRequest(api.get(AUTH_API.ME), mapCurrentUserResponse);
  },
  login(credentials) {
    return executeAuthRequest(api.post(AUTH_API.LOGIN, credentials), mapAuthResponse);
  },
  logout() {
    return executeAuthRequest(api.post(AUTH_API.LOGOUT, {}), mapActionResponse);
  },
  refreshAccessToken() {
    return requestAccessTokenRefresh();
  },
  refreshToken() {
    return requestAccessTokenRefresh();
  },
  register(accountData) {
    return executeAuthRequest(
      api.post(AUTH_API.REGISTER, normalizeRegisterPayload(accountData)),
      mapAuthResponse,
    );
  },
  resendVerification(payload) {
    return executeAuthRequest(
      api.post(AUTH_API.RESEND_VERIFICATION, normalizeEmailPayload(payload)),
      mapActionResponse,
    );
  },
  resetPassword(payload = {}) {
    return executeAuthRequest(
      api.post(AUTH_API.RESET_PASSWORD, {
        ...payload,
        confirmPassword: payload.confirmPassword ?? payload.password,
      }),
      mapActionResponse,
    );
  },
  verifyEmail(payload) {
    return executeAuthRequest(
      api.post(AUTH_API.VERIFY_EMAIL, normalizeTokenPayload(payload)),
      mapCurrentUserResponse,
    );
  },
});

export const changePassword = authService.changePassword;
export const forgotPassword = authService.forgotPassword;
export const getCurrentUser = authService.getCurrentUser;
export const login = authService.login;
export const logout = authService.logout;
export const refreshAccessToken = authService.refreshAccessToken;
export const refreshToken = authService.refreshToken;
export const register = authService.register;
export const resetPassword = authService.resetPassword;
export const resendVerification = authService.resendVerification;
export const verifyEmail = authService.verifyEmail;
