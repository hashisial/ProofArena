import mongoose from "mongoose";
import { NetworkingComment } from "../models/NetworkingComment.js";
import { NetworkingPost } from "../models/NetworkingPost.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const userSelect = "_id avatar email fullName name role username verificationStatus";
const validPostTypes = new Set(["update", "work", "share"]);
const validMediaTypes = new Set(["image", "video", "document", "link"]);

function normalizeId(value) {
  return value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    _id: normalizeId(user._id ?? user.id),
    avatar: user.avatar ?? "",
    email: user.email ?? "",
    fullName: user.fullName ?? user.name ?? "",
    name: user.name ?? user.fullName ?? "",
    role: user.role === "user" ? "client" : user.role,
    username: user.username ?? "",
    verificationStatus: user.verificationStatus ?? "pending",
  };
}

function normalizeMedia(media) {
  if (!Array.isArray(media)) {
    return [];
  }

  return media
    .map((item) => ({
      name: String(item?.name ?? "").trim().slice(0, 180),
      type: validMediaTypes.has(item?.type) ? item.type : "link",
      url: String(item?.url ?? "").trim().slice(0, 800),
    }))
    .filter((item) => item.url)
    .slice(0, 6);
}

function normalizeWork(work = {}) {
  return {
    description: String(work.description ?? "").trim().slice(0, 1000),
    title: String(work.title ?? "").trim().slice(0, 180),
    url: String(work.url ?? "").trim().slice(0, 500),
  };
}

function serializeComment(comment) {
  if (!comment) {
    return null;
  }

  return {
    _id: normalizeId(comment._id),
    author: serializeUser(comment.authorId),
    authorId: normalizeId(comment.authorId?._id ?? comment.authorId),
    content: comment.content ?? "",
    createdAt: comment.createdAt,
    postId: normalizeId(comment.postId),
    updatedAt: comment.updatedAt,
  };
}

function serializePost(post, { comments = [], viewerId } = {}) {
  if (!post) {
    return null;
  }

  const viewer = normalizeId(viewerId);
  const likes = (post.likes ?? []).map(normalizeId);

  return {
    _id: normalizeId(post._id),
    author: serializeUser(post.authorId),
    authorId: normalizeId(post.authorId?._id ?? post.authorId),
    comments,
    commentsCount: post.commentsCount ?? 0,
    content: post.content ?? "",
    createdAt: post.createdAt,
    likedByMe: likes.includes(viewer),
    likesCount: likes.length,
    media: post.media ?? [],
    sharedPost: post.sharedPostId
      ? serializePost(post.sharedPostId, { comments: [], viewerId })
      : null,
    sharedPostId: post.sharedPostId
      ? normalizeId(post.sharedPostId?._id ?? post.sharedPostId)
      : null,
    sharesCount: post.sharesCount ?? 0,
    type: post.type ?? "update",
    updatedAt: post.updatedAt,
    visibility: post.visibility ?? "public",
    work: post.work ?? {},
  };
}

function populatePost(query) {
  return query
    .populate("authorId", userSelect)
    .populate({
      path: "sharedPostId",
      populate: { path: "authorId", select: userSelect },
    });
}

async function getLatestCommentsByPostId(postIds) {
  if (postIds.length === 0) {
    return new Map();
  }

  const comments = await NetworkingComment.find({ postId: { $in: postIds } })
    .populate("authorId", userSelect)
    .sort({ createdAt: -1 })
    .limit(postIds.length * 3)
    .lean();
  const commentsByPostId = new Map();

  comments.forEach((comment) => {
    const postId = normalizeId(comment.postId);
    const current = commentsByPostId.get(postId) ?? [];

    if (current.length < 2) {
      current.push(serializeComment(comment));
      commentsByPostId.set(postId, current);
    }
  });

  return commentsByPostId;
}

export async function listNetworkingFeed({ limit = 25, q = "", viewerId } = {}) {
  ensureDatabaseConnection();

  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 60);
  const query = {};
  const cleanQuery = String(q ?? "").trim();
  const sort = cleanQuery
    ? { score: { $meta: "textScore" }, createdAt: -1 }
    : { createdAt: -1 };
  const select = cleanQuery ? { score: { $meta: "textScore" } } : {};

  if (cleanQuery) {
    query.$text = { $search: cleanQuery };
  }

  const posts = await populatePost(
    NetworkingPost.find(query).select(select).sort(sort).limit(safeLimit),
  ).lean();
  const postIds = posts.map((post) => post._id);
  const commentsByPostId = await getLatestCommentsByPostId(postIds);

  return posts.map((post) =>
    serializePost(post, {
      comments: (commentsByPostId.get(normalizeId(post._id)) ?? []).reverse(),
      viewerId,
    }),
  );
}

export async function createNetworkingPost({
  authorId,
  content,
  media,
  type = "update",
  visibility = "public",
  work,
}) {
  ensureDatabaseConnection();
  assertObjectId(authorId, "author id");

  const postType = validPostTypes.has(type) && type !== "share" ? type : "update";
  const post = await NetworkingPost.create({
    authorId,
    content: String(content ?? "").trim().slice(0, 2400),
    media: normalizeMedia(media),
    type: postType,
    visibility: visibility === "connections" ? "connections" : "public",
    work: normalizeWork(work),
  });
  const populatedPost = await populatePost(NetworkingPost.findById(post._id)).lean();

  return serializePost(populatedPost, { viewerId: authorId });
}

export async function toggleNetworkingPostLike({ postId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(postId, "post id");
  assertObjectId(userId, "user id");

  const existingLike = await NetworkingPost.exists({ _id: postId, likes: userId });

  const post = await populatePost(
    NetworkingPost.findByIdAndUpdate(
      postId,
      existingLike
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    ),
  ).lean();

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return serializePost(post, { viewerId: userId });
}

export async function listNetworkingPostComments(postId) {
  ensureDatabaseConnection();
  assertObjectId(postId, "post id");

  const comments = await NetworkingComment.find({ postId })
    .populate("authorId", userSelect)
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();

  return comments.map(serializeComment);
}

export async function createNetworkingComment({ content, postId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(postId, "post id");
  assertObjectId(userId, "user id");

  const cleanContent = String(content ?? "").trim().slice(0, 1200);

  if (!cleanContent) {
    throw new AppError("Comment cannot be empty", 400);
  }

  const post = await NetworkingPost.findById(postId).select("_id").lean();

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await NetworkingComment.create({
    authorId: userId,
    content: cleanContent,
    postId,
  });

  await NetworkingPost.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });

  const populatedComment = await NetworkingComment.findById(comment._id)
    .populate("authorId", userSelect)
    .lean();

  return serializeComment(populatedComment);
}

export async function shareNetworkingPost({ content = "", postId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(postId, "post id");
  assertObjectId(userId, "user id");

  const originalPost = await NetworkingPost.findById(postId).select("_id").lean();

  if (!originalPost) {
    throw new AppError("Post not found", 404);
  }

  const share = await NetworkingPost.create({
    authorId: userId,
    content: String(content ?? "").trim().slice(0, 1000),
    sharedPostId: postId,
    type: "share",
  });

  await NetworkingPost.findByIdAndUpdate(postId, {
    $inc: { sharesCount: 1 },
  });

  const populatedShare = await populatePost(NetworkingPost.findById(share._id)).lean();

  return serializePost(populatedShare, { viewerId: userId });
}
