import {
  followUserForUser,
  getFollowStatusForUser,
  unfollowUserForUser,
} from "../services/followService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFollowStatus = asyncHandler(async (request, response) => {
  const status = await getFollowStatusForUser({
    targetUserId: request.params.userId,
    userId: request.user.id,
  });

  sendSuccess(response, status);
});

export const followUser = asyncHandler(async (request, response) => {
  const result = await followUserForUser({
    targetUserId: request.params.userId,
    userId: request.user.id,
  });

  sendSuccess(response, result, 201);
});

export const unfollowUser = asyncHandler(async (request, response) => {
  const result = await unfollowUserForUser({
    targetUserId: request.params.userId,
    userId: request.user.id,
  });

  sendSuccess(response, result);
});
