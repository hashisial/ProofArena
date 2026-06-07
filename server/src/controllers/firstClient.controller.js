import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import * as firstClientService from "../services/firstClient.service.js";

export const getFirstClientStatus = asyncHandler(async (request, response) => {
  const status = await firstClientService.getFirstClientStatus(request.user.id);
  return successResponse(response, 200, "First client status fetched successfully", status);
});

export const refreshFirstClientStatus = asyncHandler(async (request, response) => {
  const status = await firstClientService.syncFirstClientProgress(request.user.id);
  return successResponse(response, 200, "First client status refreshed successfully", status);
});

export const getStarterChallenges = asyncHandler(async (request, response) => {
  const challenges = await firstClientService.getStarterChallenges(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Starter challenges fetched successfully", challenges);
});

export const getMyBadges = asyncHandler(async (request, response) => {
  const badges = await firstClientService.getProviderBadges(request.user.id);
  return successResponse(response, 200, "Provider badges fetched successfully", badges);
});
