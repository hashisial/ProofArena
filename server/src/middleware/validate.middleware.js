import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "request",
    message: issue.message,
  }));
}

function validatePart(source, schema) {
  return (request, response, next) => {
    const result = schema.safeParse(request[source] ?? {});

    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          400,
          formatZodErrors(result.error),
          ERROR_CODES.VALIDATION_ERROR,
        ),
      );
    }

    if (source === "query") {
      Object.defineProperty(request, "query", {
        configurable: true,
        enumerable: true,
        value: result.data,
        writable: true,
      });
    } else {
      request[source] = result.data;
    }

    return next();
  };
}

export const validateBody = (schema) => validatePart("body", schema);
export const validateParams = (schema) => validatePart("params", schema);
export const validateQuery = (schema) => validatePart("query", schema);
export const validate = (schema) => (request, response, next) => {
  const result = schema.safeParse(request);

  if (!result.success) {
    return next(
      new AppError(
        "Validation failed",
        400,
        formatZodErrors(result.error),
        ERROR_CODES.VALIDATION_ERROR,
      ),
    );
  }

  return next();
};

export function validateRequest({ body, params, query }) {
  return (request, response, next) => {
    const errors = [];

    for (const [source, schema] of Object.entries({ body, params, query })) {
      if (!schema) {
        continue;
      }

      const result = schema.safeParse(request[source] ?? {});
      if (!result.success) {
        errors.push(...formatZodErrors(result.error));
      } else {
        if (source === "query") {
          Object.defineProperty(request, "query", {
            configurable: true,
            enumerable: true,
            value: result.data,
            writable: true,
          });
        } else {
          request[source] = result.data;
        }
      }
    }

    if (errors.length > 0) {
      return next(
        new AppError("Validation failed", 400, errors, ERROR_CODES.VALIDATION_ERROR),
      );
    }

    return next();
  };
}

export { ZodError };
