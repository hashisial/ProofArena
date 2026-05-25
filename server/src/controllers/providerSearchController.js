import {
  getPublicProviderByUsername,
  requestProviderConnection,
} from "../services/providerPublicService.js";
import { searchProviders } from "../services/providerSearchService.js";
import { submitProviderVerificationRequest } from "../services/providerVerificationService.js";
import { emitUserEvent } from "../services/socketService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProviders = asyncHandler(async (request, response) => {
  const result = await searchProviders(request.query ?? {}, {
    userId: request.user?.id,
  });

  sendSuccess(response, result);
});

export const getProviderByUsername = asyncHandler(async (request, response) => {
  const result = await getPublicProviderByUsername(request.params.username, {
    viewerId: request.user?.id,
  });

  sendSuccess(response, result);
});

export const postProviderConnection = asyncHandler(async (request, response) => {
  const result = await requestProviderConnection({
    sender: request.user,
    username: request.params.username,
  });

  result.notifications?.forEach((notification) => {
    emitUserEvent(notification.userId, "notification:new", notification);
  });
  [result.senderId, result.receiverId].forEach((userId) => {
    emitUserEvent(userId, "connection:updated", result);
  });

  sendSuccess(response, result, result.status === "pending" ? 201 : 200);
});

export const postProviderVerificationRequest = asyncHandler(async (request, response) => {
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  const result = await submitProviderVerificationRequest(request.user, {
    baseUrl,
    files: request.files ?? [],
  });

  sendSuccess(response, result, 201);
});
