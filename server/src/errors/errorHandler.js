import { env } from "../config/env.js";
import { logError } from "../utils/logger.js";
import { AppError } from "./AppError.js";
import { ERROR_CODES, getDefaultErrorCode } from "./errorCodes.js";

function validationDetails(error) {
  const issues = error?.issues ?? Object.values(error?.errors ?? {});

  return issues.map((issue) => ({
    field:
      issue.path?.join?.(".") ??
      issue.path ??
      issue.field ??
      issue.properties?.path ??
      "request",
    message: issue.message ?? issue.properties?.message ?? "Invalid value",
  }));
}

function duplicateKeyDetails(error) {
  return Object.keys(error?.keyPattern ?? error?.keyValue ?? {}).map((field) => ({
    field,
    message: `${field} is already in use`,
  }));
}

function normalizeKnownError(error) {
  if (error instanceof AppError || error?.isOperational) {
    return {
      code: error.code ?? getDefaultErrorCode(error.statusCode),
      details: error.details ?? error.errors,
      isOperational: true,
      message: error.message,
      statusCode: error.statusCode ?? 500,
    };
  }

  if (error?.name === "ValidationError" || error?.name === "ZodError") {
    return {
      code: ERROR_CODES.VALIDATION_ERROR,
      details: validationDetails(error),
      isOperational: true,
      message: "Validation failed",
      statusCode: 400,
    };
  }

  if (error?.name === "CastError") {
    return {
      code: ERROR_CODES.INVALID_ID,
      details: [{ field: error.path ?? "id", message: "Invalid identifier" }],
      isOperational: true,
      message: "Invalid identifier",
      statusCode: 400,
    };
  }

  if (error?.code === 11000) {
    return {
      code: ERROR_CODES.DUPLICATE_RESOURCE,
      details: duplicateKeyDetails(error),
      isOperational: true,
      message: "A record with that value already exists",
      statusCode: 409,
    };
  }

  if (error?.name === "TokenExpiredError") {
    return {
      code: ERROR_CODES.TOKEN_EXPIRED,
      isOperational: true,
      message: "Authentication token expired",
      statusCode: 401,
    };
  }

  if (error?.name === "JsonWebTokenError" || error?.name === "NotBeforeError") {
    return {
      code: ERROR_CODES.INVALID_TOKEN,
      isOperational: true,
      message: "Authentication token is invalid",
      statusCode: 401,
    };
  }

  if (error?.code === "LIMIT_FILE_SIZE") {
    return {
      code: ERROR_CODES.FILE_TOO_LARGE,
      isOperational: true,
      message: "Uploaded file is too large",
      statusCode: 413,
    };
  }

  if (error instanceof SyntaxError && error?.status === 400 && "body" in error) {
    return {
      code: ERROR_CODES.INVALID_JSON,
      isOperational: true,
      message: "Request body contains invalid JSON",
      statusCode: 400,
    };
  }

  return {
    code: ERROR_CODES.INTERNAL_ERROR,
    isOperational: false,
    message: error?.message || "Internal server error",
    statusCode: error?.statusCode ?? error?.status ?? 500,
  };
}

export function normalizeServerError(error) {
  const normalized = normalizeKnownError(error);
  const statusCode =
    Number.isInteger(normalized.statusCode) && normalized.statusCode >= 400
      ? normalized.statusCode
      : 500;

  return {
    ...normalized,
    code: normalized.code ?? getDefaultErrorCode(statusCode),
    statusCode,
  };
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const normalized = normalizeServerError(error);
  const hideInternalError = env.isProduction && !normalized.isOperational;
  const payload = {
    success: false,
    message: hideInternalError ? "Internal server error" : normalized.message,
    code: hideInternalError ? ERROR_CODES.INTERNAL_ERROR : normalized.code,
    errors: hideInternalError ? [] : normalized.details ?? [],
  };

  if (!env.isProduction && error?.stack) {
    payload.stack = error.stack;
  }

  logError(error, request, normalized.statusCode);
  return response.status(normalized.statusCode).json(payload);
}

export default errorHandler;

