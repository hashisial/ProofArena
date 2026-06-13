const NETWORK_ERROR_CODES = new Set(["ERR_NETWORK", "ECONNREFUSED", "ENOTFOUND"]);

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.code = options.code ?? "API_ERROR";
    this.errors = options.errors ?? [];
    this.status = options.status ?? 500;
    this.statusCode = options.statusCode ?? this.status;
  }
}

export function normalizeApiError(error, fallbackMessage) {
  if (error instanceof ApiError) {
    return error;
  }

  const responseData = error?.response?.data;
  const isNetworkError =
    error?.message === "Network Error" || NETWORK_ERROR_CODES.has(error?.code);
  const isTimeout = error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT";
  const statusCode = error?.response?.status ?? (isNetworkError || isTimeout ? 503 : 500);
  const code =
    responseData?.code ??
    (isTimeout ? "REQUEST_TIMEOUT" : isNetworkError ? "NETWORK_ERROR" : error?.code) ??
    "API_ERROR";
  const message =
    fallbackMessage ??
    responseData?.message ??
    (isTimeout
      ? "Request timed out. Please try again."
      : isNetworkError
        ? "No response from server. Please check your connection."
        : error?.message || "Something went wrong. Please try again.");

  return new ApiError(message, {
    code,
    errors: responseData?.errors ?? [],
    status: statusCode,
    statusCode,
  });
}
