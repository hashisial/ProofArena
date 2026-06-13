import { validationResult } from "express-validator";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export function validateRequest(request, response, next) {
  const result = validationResult(request);

  if (result.isEmpty()) {
    next();
    return;
  }

  const errors = result.array({ onlyFirstError: true }).map((validationError) => ({
    field: validationError.path,
    message: validationError.msg,
  }));

  next(new AppError("Validation failed", 400, errors, ERROR_CODES.VALIDATION_ERROR));
}
