import mongoose from "mongoose";
import { Follow } from "../models/Follow.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

async function assertFollowTarget(userId, targetUserId, { requirePublicProfile = true } = {}) {
  assertObjectId(userId, "User id");
  assertObjectId(targetUserId, "Target user id");

  if (normalizeId(userId) === normalizeId(targetUserId)) {
    throw new AppError("Users cannot follow themselves", 400);
  }

  const targetUser = await User.findOne({
    _id: targetUserId,
    accountStatus: { $nin: ["suspended", "deleted"] },
    isSuspended: { $ne: true },
  }).select("_id").lean();

  if (!targetUser) {
    throw new AppError("Follow target is unavailable", 404);
  }

  if (requirePublicProfile) {
    const targetProfile = await UserProfile.findOne({ userId: targetUserId })
      .select("profileVisibility")
      .lean();

    if ((targetProfile?.profileVisibility ?? "public") !== "public") {
      throw new AppError("Follow target is unavailable", 404);
    }
  }
}

async function refreshFollowerCount(userId) {
  const followersCount = await Follow.countDocuments({ followingId: userId });
  await UserProfile.findOneAndUpdate(
    { userId },
    { $set: { followersCount } },
    { upsert: false },
  );

  return followersCount;
}

export async function getFollowStatusForUser({ targetUserId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(userId, "User id");
  assertObjectId(targetUserId, "Target user id");

  if (normalizeId(userId) === normalizeId(targetUserId)) {
    return {
      followed: false,
      isSelf: true,
    };
  }

  await assertFollowTarget(userId, targetUserId);

  const follow = await Follow.findOne({
    followerId: userId,
    followingId: targetUserId,
  }).lean();

  return {
    followed: Boolean(follow),
    followId: follow?._id?.toString?.() ?? null,
    isSelf: false,
  };
}

export async function followUserForUser({ targetUserId, userId }) {
  ensureDatabaseConnection();
  await assertFollowTarget(userId, targetUserId);

  const follow =
    (await Follow.findOne({ followerId: userId, followingId: targetUserId })) ??
    (await Follow.create({ followerId: userId, followingId: targetUserId }));
  const followersCount = await refreshFollowerCount(targetUserId);

  return {
    followed: true,
    followId: follow._id?.toString?.() ?? null,
    followersCount,
  };
}

export async function unfollowUserForUser({ targetUserId, userId }) {
  ensureDatabaseConnection();
  await assertFollowTarget(userId, targetUserId, {
    requirePublicProfile: false,
  });

  await Follow.findOneAndDelete({
    followerId: userId,
    followingId: targetUserId,
  });
  const followersCount = await refreshFollowerCount(targetUserId);

  return {
    followed: false,
    followersCount,
  };
}
