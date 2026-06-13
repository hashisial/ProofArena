import { AppError } from "./AppError.js";
import { ERROR_CODES } from "./errorCodes.js";

export function notFoundHandler(_request, _response, next) {
  next(new AppError("API route not found", 404, undefined, ERROR_CODES.ROUTE_NOT_FOUND));
}

export const notFound = notFoundHandler;
export default notFoundHandler;

