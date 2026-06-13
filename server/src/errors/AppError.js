import { getDefaultErrorCode } from "./errorCodes.js";

export class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined, code = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = Number.isInteger(statusCode) ? statusCode : 500;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.code = code ?? getDefaultErrorCode(this.statusCode);
    this.details = details;
    // Existing services and frontend consumers use `errors`; keep it as a compatibility alias.
    this.errors = details;
    this.isOperational = true;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;

