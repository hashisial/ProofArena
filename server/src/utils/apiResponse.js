export function sendSuccess(
  response,
  data,
  statusCode = 200,
  message = "Operation successful",
  meta = null,
) {
  return successResponse(response, statusCode, message, data, meta);
}

export function successResponse(
  response,
  statusCode = 200,
  message = "Operation successful",
  data = null,
  meta = undefined,
) {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta !== undefined && meta !== null) {
    payload.meta = meta;
  }

  return response.status(statusCode).json(payload);
}

export function createdResponse(
  response,
  message = "Resource created successfully",
  data = null,
  meta = undefined,
) {
  return successResponse(response, 201, message, data, meta);
}

export function noContentResponse(response) {
  return response.status(204).send();
}

export function errorResponse(
  response,
  statusCode = 500,
  message = "Something went wrong",
  errors = [],
  code = undefined,
) {
  const payload = {
    success: false,
    message,
    errors,
  };

  if (code) {
    payload.code = code;
  }

  return response.status(statusCode).json(payload);
}

export function paginatedResponse(response, message, data, pagination) {
  return successResponse(response, 200, message, data, { pagination });
}

export const sendCreated = createdResponse;
export const sendNoContent = noContentResponse;
export const sendError = errorResponse;
