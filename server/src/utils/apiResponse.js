export function sendSuccess(
  response,
  data,
  statusCode = 200,
  message = "Operation successful",
  meta = null,
) {
  response.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function successResponse(response, statusCode = 200, message = "Operation successful", data = null, meta = null) {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function createdResponse(response, message = "Resource created successfully", data = null, meta = null) {
  return successResponse(response, 201, message, data, meta);
}

export function noContentResponse(response) {
  return response.status(204).send();
}

export function errorResponse(response, statusCode = 500, message = "Something went wrong", errors = []) {
  return response.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

export function paginatedResponse(response, message, data, pagination) {
  return successResponse(response, 200, message, data, { pagination });
}
