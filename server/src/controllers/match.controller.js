import {
  generateMatchesForChallenge,
  generateMatchesForProvider,
  getClientRecommendedProviders as getClientRecommendedProvidersService,
  getMatchByIdForClient as getMatchByIdForClientService,
  getMatchByIdForProvider as getMatchByIdForProviderService,
  getProviderMatchedChallenges as getProviderMatchedChallengesService,
  updateClientMatchStatus as updateClientMatchStatusService,
  updateProviderMatchStatus as updateProviderMatchStatusService,
} from "../services/match.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const refreshMyMatches = asyncHandler(async (request, response) => {
  const matches = await generateMatchesForProvider(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Matches refreshed successfully", matches);
});

export const getMyMatchedChallenges = asyncHandler(async (request, response) => {
  const matches = await getProviderMatchedChallengesService(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Matched challenges fetched successfully", matches);
});

export const getProviderMatchById = asyncHandler(async (request, response) => {
  const match = await getMatchByIdForProviderService(request.user.id, request.params.matchId);
  return successResponse(response, 200, "Match fetched successfully", match);
});

export const updateProviderMatchStatus = asyncHandler(async (request, response) => {
  const match = await updateProviderMatchStatusService(
    request.user.id,
    request.params.matchId,
    request.body.status,
  );
  return successResponse(response, 200, "Match status updated successfully", match);
});

export const refreshChallengeMatches = asyncHandler(async (request, response) => {
  const matches = await generateMatchesForChallenge(
    request.params.challengeId,
    request.user.id,
    request.query ?? {},
  );
  return successResponse(response, 200, "Matches refreshed successfully", matches);
});

export const getChallengeRecommendedProviders = asyncHandler(async (request, response) => {
  const matches = await getClientRecommendedProvidersService(
    request.user.id,
    request.params.challengeId,
    request.query ?? {},
  );
  return successResponse(response, 200, "Recommended providers fetched successfully", matches);
});

export const getClientMatchById = asyncHandler(async (request, response) => {
  const match = await getMatchByIdForClientService(request.user.id, request.params.matchId);
  return successResponse(response, 200, "Match fetched successfully", match);
});

export const updateClientMatchStatus = asyncHandler(async (request, response) => {
  const match = await updateClientMatchStatusService(
    request.user.id,
    request.params.matchId,
    request.body.status,
  );
  return successResponse(response, 200, "Match status updated successfully", match);
});
