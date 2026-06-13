export class AppError extends Error {
  constructor(message, statusCode = 500, errors = undefined, code = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
