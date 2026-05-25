import {
  archiveChallenge as archiveChallengeService,
  closeChallenge as closeChallengeService,
  createChallenge as createChallengeService,
  deleteChallenge as deleteChallengeService,
  getChallengeByIdForOwner,
  getMyChallenges as getMyChallengesService,
  getPublicChallengeBySlug as getPublicChallengeBySlugService,
  getPublicChallenges as getPublicChallengesService,
  pauseChallenge as pauseChallengeService,
  publishChallenge as publishChallengeService,
  updateChallenge as updateChallengeService,
} from "../services/challenge.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createChallenge = asyncHandler(async (request, response) => {
  const challenge = await createChallengeService(request.user.id, request.body ?? {});
  return successResponse(response, 201, "Challenge created successfully", challenge);
});

export const getMyChallenges = asyncHandler(async (request, response) => {
  const challenges = await getMyChallengesService(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Challenges fetched successfully", challenges);
});

export const getPublicChallenges = asyncHandler(async (request, response) => {
  const result = await getPublicChallengesService(request.query ?? {});
  return successResponse(response, 200, "Challenges fetched successfully", result);
});

export const getChallengeById = asyncHandler(async (request, response) => {
  const challenge = await getChallengeByIdForOwner(request.user.id, request.params.challengeId);
  return successResponse(response, 200, "Challenge fetched successfully", challenge);
});

export const getPublicChallengeBySlug = asyncHandler(async (request, response) => {
  const challenge = await getPublicChallengeBySlugService(
    request.params.username,
    request.params.slug,
  );
  return successResponse(response, 200, "Challenge fetched successfully", challenge);
});

export const updateChallenge = asyncHandler(async (request, response) => {
  const challenge = await updateChallengeService(
    request.user.id,
    request.params.challengeId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Challenge updated successfully", challenge);
});

export const publishChallenge = asyncHandler(async (request, response) => {
  const challenge = await publishChallengeService(request.user.id, request.params.challengeId);
  return successResponse(response, 200, "Challenge published successfully", challenge);
});

export const pauseChallenge = asyncHandler(async (request, response) => {
  const challenge = await pauseChallengeService(request.user.id, request.params.challengeId);
  return successResponse(response, 200, "Challenge paused successfully", challenge);
});

export const closeChallenge = asyncHandler(async (request, response) => {
  const challenge = await closeChallengeService(request.user.id, request.params.challengeId);
  return successResponse(response, 200, "Challenge closed successfully", challenge);
});

export const archiveChallenge = asyncHandler(async (request, response) => {
  const challenge = await archiveChallengeService(request.user.id, request.params.challengeId);
  return successResponse(response, 200, "Challenge archived successfully", challenge);
});

export const deleteChallenge = asyncHandler(async (request, response) => {
  const challenge = await deleteChallengeService(request.user.id, request.params.challengeId);
  return successResponse(response, 200, "Challenge deleted successfully", challenge);
});
