import axios from "axios";
import { useAuthStore } from "../store/useAuthStore.js";

function normalizeApiBaseUrl(value) {
  const trimmedValue = String(value ?? "").trim();

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.replace(/\/+$/, "");
}

function getLocalApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://127.0.0.1:5000/api";
  }

  const { hostname } = window.location;
  const apiHost = hostname === "::1" ? "127.0.0.1" : hostname;

  return `http://${apiHost}:5000/api`;
}

function resolveApiBaseUrl() {
  const configuredUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  if (import.meta.env.DEV) {
    return getLocalApiBaseUrl();
  }

  return "/api";
}

export const API_BASE_URL = resolveApiBaseUrl();
const API_TIMEOUT_MS = 15000;
const publicAuthPaths = [
  "/auth/forgot-password",
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
  "/auth/refresh-token",
  "/auth/register",
  "/auth/resend-verification",
  "/auth/reset-password",
  "/auth/verify-email",
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

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.errors = options.errors ?? [];
    this.status = options.status ?? 500;
    this.statusCode = options.statusCode ?? this.status;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
});

export function getRealtimeBaseUrl() {
  const configuredRealtimeUrl = normalizeApiBaseUrl(import.meta.env.VITE_REALTIME_URL);

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
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/register") &&
      !requestUrl.includes("/auth/refresh") &&
      !requestUrl.includes("/auth/refresh-token") &&
      !requestUrl.includes("/auth/logout");

    if (canAttemptRefresh) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post("/auth/refresh-token", {});
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
        ? "API server is unreachable. Check that the backend is deployed and VITE_API_URL points to its /api URL."
        : error.message) ??
      "Unable to complete the request";
    const status = error.response?.status ?? (isNetworkError ? 503 : 500);

    if (shouldClearStaleAuth(status, message, requestUrl)) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(normalizeApiError(error, message));
  },
);

export function normalizeApiError(error, fallbackMessage) {
  const responseData = error.response?.data;
  const isNetworkError = error.message === "Network Error" || error.code === "ERR_NETWORK";
  const isTimeout = error.code === "ECONNABORTED";
  const statusCode = error.response?.status ?? (isNetworkError ? 503 : 500);
  const message =
    fallbackMessage ??
    responseData?.message ??
    (isTimeout
      ? "Request timed out. Please try again."
      : isNetworkError
        ? "No response from server. Please check your connection."
        : "Something went wrong. Please try again.");

  return new ApiError(message, {
    errors: responseData?.errors ?? [],
    status: statusCode,
    statusCode,
  });
}

function getAuthHeaders(token) {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function unwrapResponse(response) {
  return response.data?.data ?? response.data;
}

export async function apiGet(path, config = {}) {
  const response = await apiClient.get(path, config);
  return unwrapResponse(response);
}

export async function apiPost(path, data, config = {}) {
  const response = await apiClient.post(path, data, config);
  return unwrapResponse(response);
}

export async function apiPostForm(path, formData, config = {}) {
  const response = await apiClient.post(path, formData, config);
  return unwrapResponse(response);
}

export async function apiPatch(path, data, config = {}) {
  const response = await apiClient.patch(path, data, config);
  return unwrapResponse(response);
}

export async function apiPut(path, data, config = {}) {
  const response = await apiClient.put(path, data, config);
  return unwrapResponse(response);
}

export async function apiDelete(path, config = {}) {
  const response = await apiClient.delete(path, config);
  return unwrapResponse(response);
}

export async function upload(path, formData, onUploadProgress, config = {}) {
  const response = await apiClient.post(path, formData, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return unwrapResponse(response);
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
