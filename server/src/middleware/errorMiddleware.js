import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";
import { logError } from "../utils/logger.js";

export function notFound(request, response, next) {
  next(new AppError(`Route not found: ${request.method} ${request.originalUrl}`, 404));
}

export function errorHandler(error, request, response, _next) {
  const statusCode =
    error.statusCode ?? (response.statusCode === 200 ? 500 : response.statusCode);
  const isOperational = error instanceof AppError || error.isOperational;
  const message =
    env.isProduction && !isOperational
      ? "Internal server error"
      : error.message || "Server Error";

  logError(error, request, statusCode);
  return sendError(response, statusCode, message, error.errors ?? [], error.code);
}
