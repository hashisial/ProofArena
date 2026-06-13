export const ERROR_MESSAGES = Object.freeze({
  BAD_REQUEST: "Please check the information and try again.",
  CONFLICT: "That change conflicts with an existing record.",
  DUPLICATE_RESOURCE: "That value is already in use.",
  FILE_TOO_LARGE: "The selected file is too large.",
  FORBIDDEN: "You do not have permission to perform this action.",
  INTERNAL_ERROR: "Something went wrong. Please try again.",
  INVALID_ID: "The requested item could not be identified.",
  INVALID_JSON: "The request could not be processed.",
  INVALID_TOKEN: "Your session is invalid. Please sign in again.",
  NETWORK_ERROR: "No response from the server. Check your connection and try again.",
  NOT_FOUND: "The requested item could not be found.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  REQUEST_TIMEOUT: "The request took too long. Please try again.",
  ROUTE_NOT_FOUND: "The requested endpoint could not be found.",
  SERVICE_UNAVAILABLE: "This service is temporarily unavailable.",
  TOKEN_EXPIRED: "Your session expired. Please sign in again.",
  UNAUTHORIZED: "Please sign in to continue.",
  VALIDATION_ERROR: "Please check the highlighted information and try again.",
});

const STATUS_MESSAGES = Object.freeze({
  400: ERROR_MESSAGES.BAD_REQUEST,
  401: ERROR_MESSAGES.UNAUTHORIZED,
  403: ERROR_MESSAGES.FORBIDDEN,
  404: ERROR_MESSAGES.NOT_FOUND,
  409: ERROR_MESSAGES.CONFLICT,
  413: ERROR_MESSAGES.FILE_TOO_LARGE,
  429: ERROR_MESSAGES.RATE_LIMITED,
  500: ERROR_MESSAGES.INTERNAL_ERROR,
  503: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
});

export function getDefaultErrorMessage(code, status = 500) {
  return ERROR_MESSAGES[code] ?? STATUS_MESSAGES[status] ?? ERROR_MESSAGES.INTERNAL_ERROR;
}

