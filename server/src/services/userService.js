import { randomBytes } from "crypto";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { ApiUsage } from "../models/ApiUsage.js";
import { Campaign } from "../models/Campaign.js";
import { Connection } from "../models/Connection.js";
import { Conversation } from "../models/Conversation.js";
import { EmailTemplate } from "../models/EmailTemplate.js";
import { Invoice } from "../models/Invoice.js";
import { Lead } from "../models/Lead.js";
import { LeadActivity } from "../models/LeadActivity.js";
import { LeadScrapeJob } from "../models/LeadScrapeJob.js";
import { MarketplaceTransaction } from "../models/MarketplaceTransaction.js";
import { Message } from "../models/Message.js";
import { NetworkingComment } from "../models/NetworkingComment.js";
import { NetworkingPost } from "../models/NetworkingPost.js";
import { Notification } from "../models/Notification.js";
import { OutreachEmail } from "../models/OutreachEmail.js";
import { OutreachJob } from "../models/OutreachJob.js";
import { Portfolio } from "../models/Portfolio.js";
import { Proposal } from "../models/Proposal.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { Project } from "../models/Project.js";
import { Review } from "../models/Review.js";
import { ScrapeJob } from "../models/ScrapeJob.js";
import { Service } from "../models/Service.js";
import { Settings } from "../models/Settings.js";
import { Subscription } from "../models/Subscription.js";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { UserActivity } from "../models/UserActivity.js";
import { UserMedia } from "../models/UserMedia.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import {
  registerUser,
  validAccountTypes,
  validRoles,
  validVerificationStatuses,
} from "./authService.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { AppError } from "../utils/AppError.js";

function normalizeUserRole(role) {
  return role === "user" ? "client" : role;
}

function normalizeVerificationStatus(user) {
  return user.verificationStatus ??
    (user.isVerified || user.emailVerified ? "verified" : "pending");
}

function serializeManagedUser(user) {
  return {
    ...user,
    accountType: user.accountType ?? "individual",
    role: normalizeUserRole(user.role),
    verificationStatus: normalizeVerificationStatus(user),
  };
}

export async function findUsers() {
  ensureDatabaseConnection();

  const users = await User.find().sort({ createdAt: -1 }).select("-password").lean();
  const profiles = await UserProfile.find({
    userId: { $in: users.map((user) => user._id) },
  }).lean();
  const subscriptions = await Subscription.find({
    userId: { $in: users.map((user) => user._id) },
  }).lean();
  const settings = await UserSettings.find({
    userId: { $in: users.map((user) => user._id) },
  }).lean();
  const media = await UserMedia.find({
    userId: { $in: users.map((user) => user._id) },
  })
    .sort({ uploadedAt: -1 })
    .lean();
  const profileByUserId = new Map(
    profiles.map((profile) => [profile.userId.toString(), profile]),
  );
  const subscriptionByUserId = new Map(
    subscriptions.map((subscription) => [subscription.userId.toString(), subscription]),
  );
  const settingsByUserId = new Map(
    settings.map((item) => [item.userId.toString(), item]),
  );
  const mediaByUserId = media.reduce((items, item) => {
    const userId = item.userId.toString();
    const userMedia = items.get(userId) ?? [];
    userMedia.push(item);
    items.set(userId, userMedia);
    return items;
  }, new Map());

  return users.map((user) => ({
    ...serializeManagedUser(user),
    media: mediaByUserId.get(user._id.toString()) ?? [],
    profile: profileByUserId.get(user._id.toString()) ?? null,
    settings: settingsByUserId.get(user._id.toString()) ?? null,
    subscription: subscriptionByUserId.get(user._id.toString()) ?? null,
  }));
}

export async function createUserRecord(userData) {
  const { user } = await registerUser(userData, { allowRole: true });

  return user;
}

export async function createAdminUser(userData) {
  const { user } = await registerUser(
    {
      ...userData,
      role: "admin",
    },
    { allowRole: true },
  );

  const updates = {
    emailVerified: true,
    isVerified: true,
    verificationStatus: "verified",
  };

  if (Array.isArray(userData.adminPermissions)) {
    updates.adminPermissions = userData.adminPermissions;
  }

  const admin = await User.findByIdAndUpdate(user.id, updates, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .lean();

  return serializeManagedUser(admin);
}

export async function updateAdminUser(id, userData) {
  ensureDatabaseConnection();

  const updates = {};

  if (Array.isArray(userData.adminPermissions)) {
    updates.adminPermissions = userData.adminPermissions;
  }

  if (validAccountTypes.has(userData.accountType)) {
    updates.accountType = userData.accountType;
  }

  if (userData.fullName || userData.name) {
    updates.fullName = userData.fullName || userData.name;
    updates.name = userData.fullName || userData.name;
  }

  if (userData.username) {
    updates.username = String(userData.username).trim().toLowerCase();
  }

  if (typeof userData.isSuspended === "boolean") {
    updates.isSuspended = userData.isSuspended;
  }

  if (typeof userData.isVerified === "boolean") {
    updates.isVerified = userData.isVerified;
    updates.emailVerified = userData.isVerified;
    updates.verificationStatus = userData.isVerified ? "verified" : "pending";
  }

  if (validRoles.has(userData.role)) {
    updates.role = userData.role;
  }

  if (validVerificationStatuses.has(userData.verificationStatus)) {
    updates.verificationStatus = userData.verificationStatus;
    updates.isVerified = userData.verificationStatus === "verified";
    updates.emailVerified = userData.verificationStatus === "verified";
  }

  const user = await User.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true },
  )
    .select("-password")
    .lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return serializeManagedUser(user);
}

export async function deleteUserRecord(id) {
  ensureDatabaseConnection();

  const user = await User.findById(id).select("-password").lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const conversationIds = await Conversation.find({ participants: id }).distinct("_id");
  const networkingPostIds = await NetworkingPost.find({ authorId: id }).distinct("_id");

  await Promise.all([
    AnalyticsEvent.deleteMany({ userId: id }),
    ApiUsage.deleteMany({ userId: id }),
    Campaign.deleteMany({ userId: id }),
    Connection.deleteMany({ $or: [{ senderId: id }, { receiverId: id }] }),
    Conversation.deleteMany({ _id: { $in: conversationIds } }),
    EmailTemplate.deleteMany({ userId: id }),
    Invoice.deleteMany({ userId: id }),
    Lead.deleteMany({ userId: id }),
    LeadActivity.deleteMany({ userId: id }),
    LeadScrapeJob.deleteMany({ userId: id }),
    MarketplaceTransaction.deleteMany({ $or: [{ clientId: id }, { providerId: id }] }),
    Message.deleteMany({
      $or: [
        { conversationId: { $in: conversationIds } },
        { senderId: id },
      ],
    }),
    Message.updateMany({ readBy: id }, { $pull: { readBy: id } }),
    NetworkingComment.deleteMany({
      $or: [{ authorId: id }, { postId: { $in: networkingPostIds } }],
    }),
    NetworkingPost.deleteMany({ authorId: id }),
    NetworkingPost.updateMany(
      { likes: id },
      { $pull: { likes: id } },
    ),
    NetworkingPost.updateMany(
      { sharedPostId: { $in: networkingPostIds } },
      { $set: { sharedPostId: null } },
    ),
    Notification.deleteMany({ userId: id }),
    OutreachEmail.deleteMany({ userId: id }),
    OutreachJob.deleteMany({ userId: id }),
    Portfolio.deleteMany({ userId: id }),
    Proposal.deleteMany({ providerId: id }),
    ProviderProfile.deleteMany({ userId: id }),
    Project.deleteMany({ $or: [{ clientId: id }, { providerId: id }] }),
    Review.deleteMany({
      $or: [
        { reviewerId: id },
        { targetUserId: id },
        { userId: id },
      ],
    }),
    ScrapeJob.deleteMany({ userId: id }),
    Service.deleteMany({ $or: [{ userId: id }, { providerId: id }] }),
    Settings.deleteMany({ userId: id }),
    Subscription.deleteMany({ userId: id }),
    Team.deleteMany({ ownerId: id }),
    Team.updateMany({}, { $pull: { members: { userId: id } } }),
    UserActivity.deleteMany({ userId: id }),
    UserMedia.deleteMany({ userId: id }),
    UserProfile.deleteMany({ userId: id }),
    UserSettings.deleteMany({ userId: id }),
  ]);

  await User.findByIdAndDelete(id);

  return user;
}

export async function resetUserPassword(id, nextPassword) {
  ensureDatabaseConnection();

  const user = await User.findById(id).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const generatedPassword = !nextPassword;
  const password = nextPassword || randomBytes(9).toString("base64url");

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  user.password = password;
  user.passwordResetExpires = null;
  user.passwordResetToken = "";
  await user.save();

  return {
    generatedPassword,
    message: "User password reset successfully",
    temporaryPassword: generatedPassword ? password : undefined,
    user: {
      email: user.email,
      id: user._id.toString(),
      name: user.fullName || user.name,
      role: normalizeUserRole(user.role),
    },
  };
}

export async function updateOwnAdminPassword(adminId, currentPassword, nextPassword) {
  ensureDatabaseConnection();

  if (!adminId) {
    throw new AppError("Environment admin credentials are managed in deployment settings", 400);
  }

  const admin = await User.findOne({ _id: adminId, role: "admin" }).select("+password");

  if (!admin || !(await admin.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  admin.password = nextPassword;
  await admin.save();

  return { message: "Admin password updated" };
}
