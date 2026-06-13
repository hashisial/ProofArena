import axios from "axios";
import { clientEnv } from "../config/env.js";
import { AUTH_API } from "../constants/apiEndpoints.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { unwrapApiResponse } from "./apiContracts.js";
import { ApiError, normalizeApiError } from "./apiErrors.js";

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "::1", "localhost"]);
let unauthorizedHandler = null;

export function normalizeApiBaseUrl(value) {
  const trimmedValue = String(value ?? "").trim();

  if (!trimmedValue) {
    return "";
  }

  const normalizedValue = trimmedValue.replace(/\/+$/, "");

  if (/^https?:\/\/[^/]+$/i.test(normalizedValue) || normalizedValue === "") {
    return `${normalizedValue}/api`;
  }

  if (normalizedValue === "/") {
    return "/api";
  }

  return normalizedValue;
}

function isLoopbackApiBaseUrl(value) {
  try {
    const fallbackOrigin =
      typeof window === "undefined" ? "http://localhost" : window.location.origin;
    return LOOPBACK_HOSTS.has(new URL(value, fallbackOrigin).hostname);
  } catch {
    return false;
  }
}

function getLocalApiBaseUrl() {
  if (typeof window === "undefined") {
    return "/api";
  }

  const { hostname } = window.location;
  const apiHost = hostname === "::1" ? "127.0.0.1" : hostname;

  return `http://${apiHost}:5000/api`;
}

export function resolveApiBaseUrl() {
  const configuredUrl = normalizeApiBaseUrl(clientEnv.apiBaseUrl);

  if (configuredUrl && (!clientEnv.isProduction || !isLoopbackApiBaseUrl(configuredUrl))) {
    return configuredUrl;
  }

  if (clientEnv.isDevelopment) {
    return getLocalApiBaseUrl();
  }

  return "/api";
}

export const API_BASE_URL = resolveApiBaseUrl();
export const API_TIMEOUT_MS = 15000;
const publicAuthPaths = [
  AUTH_API.FORGOT_PASSWORD,
  AUTH_API.LOGIN,
  AUTH_API.LOGOUT,
  AUTH_API.REFRESH_ALIAS,
  AUTH_API.REFRESH_TOKEN,
  AUTH_API.REGISTER,
  AUTH_API.RESEND_VERIFICATION,
  AUTH_API.RESET_PASSWORD,
  AUTH_API.VERIFY_EMAIL,
];

function isPublicAuthPath(url = "") {
  const path = String(url);
  return publicAuthPaths.some((authPath) => path.includes(authPath));
}

function shouldClearStaleAuth(status, message = "", url = "") {
  if (isPublicAuthPath(url)) {
    return false;
  }

  if (status === 401) {
    return true;
  }

  return status === 403 && /suspended|not available|deleted|no longer/i.test(message);
}

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
});

export function getRealtimeBaseUrl() {
  const configuredRealtimeUrl = normalizeApiBaseUrl(clientEnv.realtimeUrl);

  if (configuredRealtimeUrl) {
    return configuredRealtimeUrl;
  }

  if (API_BASE_URL.startsWith("/")) {
    return window.location.origin;
  }

  return API_BASE_URL.replace(/\/api(?:\/v\d+)?\/?$/, "");
}

apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers?.["Content-Type"];
  }

  if (config.skipUserAuth) {
    delete config.skipUserAuth;
    return config;
  }

  const token = useAuthStore.getState().accessToken;

  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config ?? {};
    const responseData = error.response?.data;
    const isNetworkError = error.message === "Network Error" || error.code === "ERR_NETWORK";
    const requestUrl = String(originalRequest.url ?? "");
    const canAttemptRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !requestUrl.includes(AUTH_API.LOGIN) &&
      !requestUrl.includes(AUTH_API.REGISTER) &&
      !requestUrl.includes(AUTH_API.REFRESH_ALIAS) &&
      !requestUrl.includes(AUTH_API.REFRESH_TOKEN) &&
      !requestUrl.includes(AUTH_API.LOGOUT);

    if (canAttemptRefresh) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post(AUTH_API.REFRESH_TOKEN, {});
        const authPayload = refreshResponse.data?.data ?? refreshResponse.data;
        const nextToken =
          authPayload?.accessToken ??
          authPayload?.token;

        if (nextToken) {
          if (authPayload?.user) {
            useAuthStore.getState().setAuth({
              accessToken: nextToken,
              user: authPayload.user,
            });
          } else {
            useAuthStore.getState().setAccessToken(nextToken);
          }
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        }

        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
      }
    }

    const message =
      responseData?.message ??
      (isNetworkError
        ? "API server is unreachable. Check that the backend is deployed and VITE_API_BASE_URL points to its origin or API base URL."
        : error.message) ??
      "Unable to complete the request";
    const status = error.response?.status ?? (isNetworkError ? 503 : 500);
    const normalizedError = normalizeApiError(error, message);

    if (shouldClearStaleAuth(status, message, requestUrl)) {
      useAuthStore.getState().clearAuth();
      unauthorizedHandler?.(normalizedError);
    }

    return Promise.reject(normalizedError);
  },
);

export { ApiError, normalizeApiError };

function getAuthHeaders(token) {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet(path, config = {}) {
  const response = await apiClient.get(path, config);
  return unwrapApiResponse(response);
}

export async function apiPost(path, data, config = {}) {
  const response = await apiClient.post(path, data, config);
  return unwrapApiResponse(response);
}

export async function apiPostForm(path, formData, config = {}) {
  const response = await apiClient.post(path, formData, config);
  return unwrapApiResponse(response);
}

export async function apiPatch(path, data, config = {}) {
  const response = await apiClient.patch(path, data, config);
  return unwrapApiResponse(response);
}

export async function apiPut(path, data, config = {}) {
  const response = await apiClient.put(path, data, config);
  return unwrapApiResponse(response);
}

export async function apiDelete(path, config = {}) {
  const response = await apiClient.delete(path, config);
  return unwrapApiResponse(response);
}

export async function upload(path, formData, onUploadProgress, config = {}) {
  const response = await apiClient.post(path, formData, {
    ...config,
    onUploadProgress,
  });

  return unwrapApiResponse(response);
}

export const api = {
  delete: apiDelete,
  get: apiGet,
  patch: apiPatch,
  post: apiPost,
  put: apiPut,
  upload,
};

export function withAuth(token, config = {}) {
  return {
    ...config,
    headers: {
      ...config.headers,
      ...getAuthHeaders(token),
    },
  };
}
