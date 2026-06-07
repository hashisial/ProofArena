import {
  getMySavedProviders as getMySavedProvidersService,
  getSavedProviderStatus as getSavedProviderStatusService,
  saveProvider as saveProviderService,
  unsaveProvider as unsaveProviderService,
  updateSavedProvider as updateSavedProviderService,
} from "../services/savedProvider.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function getClientId(request) {
  if (!request.user?.id) {
    throw new AppError("Authentication required", 401);
  }

  if (request.user.role !== "client") {
    throw new AppError("Only authenticated clients can manage saved providers", 403);
  }

  return request.user.id;
}

export const saveProvider = asyncHandler(async (request, response) => {
  const result = await saveProviderService(getClientId(request), request.body ?? {});

  successResponse(response, 201, "Provider saved successfully", result);
});

export const getMySavedProviders = asyncHandler(async (request, response) => {
  const result = await getMySavedProvidersService(getClientId(request), request.query ?? {});

  successResponse(response, 200, "Saved providers fetched successfully", result);
});

export const updateSavedProvider = asyncHandler(async (request, response) => {
  const result = await updateSavedProviderService(
    getClientId(request),
    request.params.savedProviderId,
    request.body ?? {},
  );

  successResponse(response, 200, "Saved provider updated successfully", result);
});

export const unsaveProvider = asyncHandler(async (request, response) => {
  const result = await unsaveProviderService(
    getClientId(request),
    request.params.providerId,
    request.query?.challengeId,
  );

  successResponse(response, 200, "Provider removed from saved list", result);
});

export const getSavedProviderStatus = asyncHandler(async (request, response) => {
  const result = await getSavedProviderStatusService(getClientId(request), request.params.providerId);

  successResponse(response, 200, "Saved provider status fetched successfully", result);
});
