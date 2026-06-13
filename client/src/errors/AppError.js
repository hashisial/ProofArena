export class AppError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? "INTERNAL_ERROR";
    this.status = options.status ?? options.statusCode ?? 500;
    this.statusCode = this.status;
    this.details = options.details ?? options.errors ?? [];
    // Existing feature helpers consume `errors`; keep it as a compatibility alias.
    this.errors = this.details;
    this.cause = options.cause;
    this.isOperational = true;
  }
}

export default AppError;

