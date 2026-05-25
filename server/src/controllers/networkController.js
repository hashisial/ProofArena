import {
  createNetworkingComment,
  createNetworkingPost,
  listNetworkingFeed,
  listNetworkingPostComments,
  shareNetworkingPost,
  toggleNetworkingPostLike,
} from "../services/networkingService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNetworkFeed = asyncHandler(async (request, response) => {
  const posts = await listNetworkingFeed({
    limit: request.query.limit,
    q: request.query.q,
    viewerId: request.user.id,
  });

  sendSuccess(response, { items: posts });
});

export const postNetworkUpdate = asyncHandler(async (request, response) => {
  const post = await createNetworkingPost({
    authorId: request.user.id,
    content: request.body?.content,
    media: request.body?.media,
    type: request.body?.type,
    visibility: request.body?.visibility,
    work: request.body?.work,
  });

  sendSuccess(response, post, 201);
});

export const likeNetworkPost = asyncHandler(async (request, response) => {
  const post = await toggleNetworkingPostLike({
    postId: request.params.postId,
    userId: request.user.id,
  });

  sendSuccess(response, post);
});

export const getNetworkComments = asyncHandler(async (request, response) => {
  const comments = await listNetworkingPostComments(request.params.postId);

  sendSuccess(response, { items: comments });
});

export const postNetworkComment = asyncHandler(async (request, response) => {
  const comment = await createNetworkingComment({
    content: request.body?.content,
    postId: request.params.postId,
    userId: request.user.id,
  });

  sendSuccess(response, comment, 201);
});

export const shareNetworkPost = asyncHandler(async (request, response) => {
  const post = await shareNetworkingPost({
    content: request.body?.content,
    postId: request.params.postId,
    userId: request.user.id,
  });

  sendSuccess(response, post, 201);
});
