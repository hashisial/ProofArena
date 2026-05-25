import { AppError } from "../utils/AppError.js";
import { logError } from "../utils/logger.js";

export function notFound(request, response, next) {
  next(new AppError(`Route not found: ${request.method} ${request.originalUrl}`, 404));
}

export function errorHandler(error, request, response, _next) {
  const statusCode =
    error.statusCode ?? (response.statusCode === 200 ? 500 : response.statusCode);
  const errorResponse = {
    errors: error.errors ?? [],
    success: false,
    message: error.message || "Server Error",
  };

  logError(error, request, statusCode);
  response.status(statusCode).json(errorResponse);
}
