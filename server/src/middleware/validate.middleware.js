import { ZodError } from "zod";
import { errorResponse } from "../utils/apiResponse.js";

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
      return errorResponse(response, 400, "Validation failed", formatZodErrors(result.error));
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
    return errorResponse(response, 400, "Validation failed", formatZodErrors(result.error));
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
      return errorResponse(response, 400, "Validation failed", errors);
    }

    return next();
  };
}

export { ZodError };
