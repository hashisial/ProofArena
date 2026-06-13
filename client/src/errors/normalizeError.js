import { AppError } from "./AppError.js";
import { getDefaultErrorMessage } from "./errorMessages.js";

const NETWORK_ERROR_CODES = new Set(["ERR_NETWORK", "ECONNREFUSED", "ENOTFOUND"]);
const TIMEOUT_ERROR_CODES = new Set(["ECONNABORTED", "ETIMEDOUT"]);

function normalizeOptions(options) {
  return typeof options === "string" ? { fallbackMessage: options } : options ?? {};
}

function normalizeDetails(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string"
        ? { field: "request", message: item }
        : {
            field: item?.field ?? item?.path ?? "request",
            message: item?.message ?? "Invalid value",
          },
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value).map(([field, detail]) => ({
      field,
      message: typeof detail === "string" ? detail : detail?.message ?? "Invalid value",
    }));
  }

  return [];
}

function safeResponseMessage(responseData, status, code) {
  if (status >= 500 && code !== "SERVICE_UNAVAILABLE") {
    return getDefaultErrorMessage(code, status);
  }

  return responseData?.message || getDefaultErrorMessage(code, status);
}

export function normalizeError(error, options = {}) {
  if (error instanceof AppError) {
    return error;
  }

  const { fallbackMessage } = normalizeOptions(options);
  const responseData = error?.response?.data;
  const isNetworkError =
    error?.message === "Network Error" || NETWORK_ERROR_CODES.has(error?.code);
  const isTimeout = TIMEOUT_ERROR_CODES.has(error?.code);
  const status = error?.response?.status ?? (isNetworkError || isTimeout ? 503 : 500);
  const code =
    responseData?.code ??
    (isTimeout ? "REQUEST_TIMEOUT" : isNetworkError ? "NETWORK_ERROR" : error?.code) ??
    "INTERNAL_ERROR";
  const details = normalizeDetails(responseData?.errors ?? responseData?.details ?? error?.errors);
  const message =
    fallbackMessage ??
    (isTimeout || isNetworkError
      ? getDefaultErrorMessage(code, status)
      : safeResponseMessage(responseData, status, code));

  return new AppError(message, {
    cause: error,
    code,
    details,
    status,
  });
}

export function getUserErrorMessage(error, fallbackMessage) {
  const normalized = normalizeError(error, { fallbackMessage });

  if (normalized.code === "VALIDATION_ERROR" && normalized.details.length > 0) {
    const messages = normalized.details.map((item) => item.message).filter(Boolean);
    return [...new Set(messages)].join(" ");
  }

  return normalized.message;
}

export function getValidationErrors(error) {
  const normalized = normalizeError(error);

  return normalized.details.reduce((errors, item) => {
    if (item.field && !errors[item.field]) {
      errors[item.field] = item.message;
    }

    return errors;
  }, {});
}

