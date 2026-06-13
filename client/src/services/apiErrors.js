// Compatibility facade. New code should import from `errors/`.
export { AppError as ApiError } from "../errors/AppError.js";
export { normalizeError as normalizeApiError } from "../errors/normalizeError.js";
