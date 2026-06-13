export function isApiResponseEnvelope(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.success === "boolean" &&
      typeof value.message === "string",
  );
}

export function parseApiResponse(response) {
  const payload = isApiResponseEnvelope(response) ? response : response?.data ?? response;

  if (!isApiResponseEnvelope(payload)) {
    return {
      data: payload,
      message: "",
      meta: undefined,
      success: true,
    };
  }

  return {
    data: payload.data,
    message: payload.message,
    meta: payload.meta,
    success: payload.success,
  };
}

export function unwrapApiResponse(response) {
  const payload = isApiResponseEnvelope(response) ? response : response?.data ?? response;
  const parsedResponse = parseApiResponse(response);

  return parsedResponse.data ?? payload;
}
