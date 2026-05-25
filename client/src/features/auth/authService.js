import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

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

async function withTokenAlias(request) {
  const response = await request;

  if (response?.accessToken && !response.token) {
    return {
      ...response,
      token: response.accessToken,
    };
  }

  return response;
}

export const authService = Object.freeze({
  changePassword(payload = {}) {
    return api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
      ...payload,
      confirmNewPassword: payload.confirmNewPassword ?? payload.newPassword,
    });
  },
  forgotPassword(payload) {
    return api.post(API_ENDPOINTS.FORGOT_PASSWORD, normalizeEmailPayload(payload));
  },
  getCurrentUser() {
    return api.get(API_ENDPOINTS.ME);
  },
  login(credentials) {
    return withTokenAlias(api.post(API_ENDPOINTS.LOGIN, credentials));
  },
  logout() {
    return api.post(API_ENDPOINTS.LOGOUT, {});
  },
  refreshToken() {
    return withTokenAlias(api.post(API_ENDPOINTS.REFRESH_TOKEN, {}));
  },
  register(accountData) {
    return withTokenAlias(api.post(API_ENDPOINTS.REGISTER, normalizeRegisterPayload(accountData)));
  },
  resetPassword(payload = {}) {
    return api.post(API_ENDPOINTS.RESET_PASSWORD, {
      ...payload,
      confirmPassword: payload.confirmPassword ?? payload.password,
    });
  },
  resendVerification(payload) {
    return api.post(API_ENDPOINTS.RESEND_VERIFICATION, normalizeEmailPayload(payload));
  },
  verifyEmail(payload) {
    return api.post(API_ENDPOINTS.VERIFY_EMAIL, normalizeTokenPayload(payload));
  },
});

export const changePassword = authService.changePassword;
export const forgotPassword = authService.forgotPassword;
export const getCurrentUser = authService.getCurrentUser;
export const login = authService.login;
export const logout = authService.logout;
export const refreshToken = authService.refreshToken;
export const register = authService.register;
export const resetPassword = authService.resetPassword;
export const resendVerification = authService.resendVerification;
export const verifyEmail = authService.verifyEmail;
