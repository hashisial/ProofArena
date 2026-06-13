export {
  API_BASE_URL,
  API_TIMEOUT_MS,
  api,
  apiClient,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPostForm,
  apiPut,
  getRealtimeBaseUrl,
  normalizeApiBaseUrl,
  registerUnauthorizedHandler,
  resolveApiBaseUrl,
  upload,
  withAuth,
} from "./apiClient.js";
export { isApiResponseEnvelope, parseApiResponse, unwrapApiResponse } from "./apiContracts.js";
export { ApiError, normalizeApiError } from "./apiErrors.js";
export {
  AppError,
  ERROR_MESSAGES,
  getDefaultErrorMessage,
  getUserErrorMessage,
  getValidationErrors,
  normalizeError,
} from "../errors/index.js";
export { buildQueryString, mapCollectionItems, mapItemsResponse } from "./shared/index.js";
