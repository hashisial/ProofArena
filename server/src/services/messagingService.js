import mongoose from "mongoose";
import { Connection } from "../models/Connection.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { ensureEnvironmentAdmin } from "./authService.js";
import { buildLocalUploadUrl, uploadMessageAsset } from "./cloudinaryService.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { notifyNewMessage } from "./notificationService.js";

const userSelect = "_id accountType avatar email fullName name role username";
const attachmentTypes = new Set(["image", "video", "document", "audio", "other"]);

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
}

function normalizeId(value) {
  return value?.toString?.() ?? String(value ?? "");
}

function sanitizeMessageText(value) {
  return String(value ?? "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+$/g, "")
    .slice(0, 5000);
}

function uniqueIds(values) {
  return Array.from(new Set(values.map(normalizeId).filter(Boolean)));
}

function getDirectKey(participantIds = []) {
  return uniqueIds(participantIds).sort().join(":");
}

function normalizeAttachments(attachments) {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .map((attachment) => ({
      fileName: String(attachment?.fileName ?? attachment?.name ?? "").trim().slice(0, 180),
      fileType: String(attachment?.fileType ?? attachment?.mimeType ?? "").trim().slice(0, 120),
      mimeType: String(attachment?.mimeType ?? "").trim().slice(0, 120),
      name: String(attachment?.name ?? "").trim().slice(0, 180),
      publicId: String(attachment?.publicId ?? "").trim().slice(0, 240),
      size: Number.isFinite(Number(attachment?.size)) ? Number(attachment.size) : 0,
      type: attachmentTypes.has(String(attachment?.type ?? "").trim())
        ? String(attachment.type).trim()
        : "other",
      url: String(attachment?.url ?? "").trim(),
    }))
    .filter((attachment) => attachment.url)
    .slice(0, 8);
}

function getAttachmentType(file = {}) {
  const mimeType = String(file.mimetype ?? "").toLowerCase();

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  if (mimeType === "application/pdf" || mimeType.startsWith("text/")) {
    return "document";
  }

  return "other";
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  const fullName = user.fullName ?? user.name ?? "";

  return {
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    email: user.email ?? "",
    fullName,
    id: normalizeId(user._id ?? user.id),
    name: user.name ?? fullName,
    role: user.role === "user" ? "client" : user.role,
    username: user.username ?? "",
  };
}

export function serializeMessage(message) {
  if (!message) {
    return null;
  }

  return {
    _id: normalizeId(message._id),
    attachments: (message.attachments ?? []).map((attachment) => ({
      ...attachment,
      fileName: attachment.fileName || attachment.name || "",
      fileType: attachment.fileType || attachment.mimeType || "",
      name: attachment.name || attachment.fileName || "",
    })),
    conversationId: normalizeId(message.conversationId),
    createdAt: message.createdAt,
    deliveredTo: (message.deliveredTo ?? []).map(normalizeId),
    deletedFor: (message.deletedFor ?? []).map(normalizeId),
    editedAt: message.editedAt ?? null,
    isDeleted: Boolean(message.isDeleted),
    readBy: (message.readBy ?? []).map(normalizeId),
    receiverIds: (message.receiverIds ?? []).map(normalizeId),
    senderId: normalizeId(message.senderId?._id ?? message.senderId),
    text: message.text ?? "",
    type: message.type ?? "text",
    updatedAt: message.updatedAt,
  };
}

function serializeUnreadCounts(conversation) {
  const value = conversation.unreadCounts;

  if (!value) {
    return {};
  }

  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  }

  return Object.fromEntries(Object.entries(value));
}

function serializeConversation(conversation) {
  return {
    _id: normalizeId(conversation._id),
    createdBy: conversation.createdBy ? normalizeId(conversation.createdBy) : null,
    kind: conversation.kind ?? "direct",
    lastMessage: serializeMessage(conversation.lastMessage),
    lastMessageAt: conversation.lastMessageAt ?? conversation.updatedAt,
    metadata: conversation.metadata ?? {},
    participants: (conversation.participants ?? []).map((participant) =>
      typeof participant === "object" && participant.email
        ? serializeUser(participant)
        : { id: normalizeId(participant) },
    ),
    priority: conversation.priority ?? "normal",
    relatedProjectId: conversation.relatedProjectId ? normalizeId(conversation.relatedProjectId) : null,
    subject: conversation.subject ?? "",
    supportStatus: conversation.supportStatus ?? "open",
    type: conversation.type ?? conversation.kind ?? "direct",
    unreadCounts: serializeUnreadCounts(conversation),
    updatedAt: conversation.updatedAt,
  };
}

async function populateConversation(query) {
  return query
    .populate("participants", userSelect)
    .populate("lastMessage")
    .lean();
}

export async function findMessagingAdminUser(currentUserId) {
  ensureDatabaseConnection();
  await ensureEnvironmentAdmin();

  const query = {
    isSuspended: { $ne: true },
    role: "admin",
  };

  if (currentUserId) {
    query._id = { $ne: currentUserId };
  }

  return User.findOne(query).sort({ createdAt: 1 }).select(userSelect).lean();
}

export async function findConversationsForUser(userId) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");

  const conversations = await populateConversation(
    Conversation.find({ participants: userId, isArchivedFor: { $ne: userId } }).sort({
      lastMessageAt: -1,
      updatedAt: -1,
    }),
  );

  return conversations.map(serializeConversation);
}

async function assertNoBlockedRelationship(userId, participantIds = []) {
  const otherIds = uniqueIds(participantIds).filter(
    (participantId) => participantId !== normalizeId(userId),
  );

  if (otherIds.length === 0) {
    return;
  }

  const blockedConnection = await Connection.findOne({
    status: "blocked",
    $or: [
      { receiverId: { $in: otherIds }, senderId: userId },
      { receiverId: userId, senderId: { $in: otherIds } },
    ],
  }).lean();

  if (blockedConnection) {
    throw new AppError("Messaging is unavailable for this relationship", 403);
  }
}

async function assertUsersExist(participantIds) {
  const users = await User.find({
    _id: { $in: participantIds },
    isSuspended: { $ne: true },
  })
    .select("_id")
    .lean();

  if (users.length !== participantIds.length) {
    throw new AppError("One or more conversation participants are unavailable", 404);
  }
}

export async function findOrCreateConversation({
  createdBy,
  kind = "direct",
  metadata = {},
  participantIds,
  priority = "normal",
  relatedProjectId = null,
  subject = "",
  supportStatus = "open",
} = {}) {
  ensureDatabaseConnection();

  const ids = uniqueIds(participantIds);

  if (ids.length < 2) {
    throw new AppError("Conversation requires at least two participants", 400);
  }

  if (kind === "direct" && ids.length !== 2) {
    throw new AppError("Direct conversation requires exactly two participants", 400);
  }

  if (new Set(ids).size !== ids.length) {
    throw new AppError("Conversation participants must be unique", 400);
  }

  ids.forEach((id) => assertObjectId(id, "participant id"));
  await assertUsersExist(ids);
  await assertNoBlockedRelationship(createdBy ?? ids[0], ids);

  let existing = null;

  if (kind === "direct") {
    existing = await populateConversation(
      Conversation.findOne({ directKey: getDirectKey(ids), kind: "direct" }),
    );

    if (!existing) {
      existing = await populateConversation(
        Conversation.findOne({
          kind: "direct",
          participants: { $all: ids },
          $expr: { $eq: [{ $size: "$participants" }, ids.length] },
        }),
      );
    }
  } else {
    existing = await populateConversation(
      Conversation.findOne({
        kind,
        participants: { $all: ids },
        $expr: { $eq: [{ $size: "$participants" }, ids.length] },
      }),
    );
  }

  if (existing) {
    if (kind === "support" && existing.kind !== "support") {
      const updated = await populateConversation(
        Conversation.findByIdAndUpdate(
          existing._id,
          {
            $set: {
              kind,
              priority,
              subject,
              supportStatus,
            },
          },
          { returnDocument: "after" },
        ),
      );

      return serializeConversation(updated);
    }

    return serializeConversation(existing);
  }

  let conversation;

  try {
    conversation = await Conversation.create({
      createdBy: createdBy ?? ids[0],
      kind,
      metadata,
      participants: ids,
      priority,
      relatedProjectId: relatedProjectId && mongoose.Types.ObjectId.isValid(relatedProjectId)
        ? relatedProjectId
        : null,
      subject,
      supportStatus,
      type: kind,
    });
  } catch (error) {
    if (kind === "direct" && error?.code === 11000) {
      const duplicate = await populateConversation(
        Conversation.findOne({ directKey: getDirectKey(ids), kind: "direct" }),
      );

      if (duplicate) {
        return serializeConversation(duplicate);
      }
    }

    throw error;
  }

  const populated = await populateConversation(Conversation.findById(conversation._id));

  return serializeConversation(populated);
}

export async function findOrCreateAdminConversation(userId) {
  const admin = await findMessagingAdminUser(userId);

  if (!admin) {
    throw new AppError("No database-backed admin is available for chat", 503);
  }

  return findOrCreateConversation({
    createdBy: userId,
    kind: "support",
    participantIds: [userId, admin._id],
    priority: "normal",
    subject: "Admin support",
    supportStatus: "open",
  });
}

export async function findSupportConversations() {
  ensureDatabaseConnection();

  const conversations = await populateConversation(
    Conversation.find({ kind: "support" }).sort({
      supportStatus: 1,
      priority: -1,
      lastMessageAt: -1,
      updatedAt: -1,
    }),
  );

  return conversations.map(serializeConversation);
}

export async function findSupportMessages(conversationId) {
  ensureDatabaseConnection();
  assertObjectId(conversationId, "conversation id");

  const conversation = await Conversation.findOne({
    _id: conversationId,
    kind: "support",
  }).lean();

  if (!conversation) {
    throw new AppError("Support conversation not found", 404);
  }

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(300)
    .lean();

  return messages.map(serializeMessage);
}

export async function updateSupportConversation(conversationId, updates = {}) {
  ensureDatabaseConnection();
  assertObjectId(conversationId, "conversation id");

  const allowedUpdates = {};
  const priorities = new Set(["low", "normal", "high", "urgent"]);
  const statuses = new Set(["open", "pending", "resolved", "closed"]);

  if (priorities.has(updates.priority)) {
    allowedUpdates.priority = updates.priority;
  }

  if (statuses.has(updates.supportStatus)) {
    allowedUpdates.supportStatus = updates.supportStatus;
  }

  if (updates.subject !== undefined) {
    allowedUpdates.subject = String(updates.subject ?? "").trim().slice(0, 180);
  }

  const conversation = await populateConversation(
    Conversation.findOneAndUpdate(
      { _id: conversationId, kind: "support" },
      { $set: allowedUpdates },
      { returnDocument: "after", runValidators: true },
    ),
  );

  if (!conversation) {
    throw new AppError("Support conversation not found", 404);
  }

  return serializeConversation(conversation);
}

export async function createSupportAdminMessage({
  adminId,
  attachments,
  conversationId,
  text,
}) {
  ensureDatabaseConnection();
  assertObjectId(adminId, "admin id");
  assertObjectId(conversationId, "conversation id");

  const conversation = await Conversation.findOne({
    _id: conversationId,
    kind: "support",
  }).lean();

  if (!conversation) {
    throw new AppError("Support conversation not found", 404);
  }

  const adminIsParticipant = conversation.participants
    .map(normalizeId)
    .includes(normalizeId(adminId));

  if (!adminIsParticipant) {
    await Conversation.findByIdAndUpdate(conversationId, {
      $addToSet: { participants: adminId },
    });
  }

  return createConversationMessage({
    attachments,
    conversationId,
    senderId: adminId,
    text,
  });
}

export async function assertConversationAccess(conversationId, userId) {
  ensureDatabaseConnection();
  assertObjectId(conversationId, "conversation id");
  assertObjectId(userId, "user id");

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  }).lean();

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  return {
    conversation,
    participantIds: (conversation.participants ?? []).map(normalizeId),
  };
}

export async function findMessagesForConversation({ conversationId, limit = 200, page = 1, userId }) {
  await assertConversationAccess(conversationId, userId);

  const safeLimit = Math.min(Math.max(Number(limit) || 200, 1), 300);
  const safePage = Math.max(Number(page) || 1, 1);
  const messages = await Message.find({ conversationId })
    .where("deletedFor")
    .ne(userId)
    .sort({ createdAt: 1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .lean();

  return messages.map(serializeMessage);
}

export async function createConversationMessage({
  attachments,
  conversationId,
  senderId,
  text,
}) {
  const { conversation, participantIds } = await assertConversationAccess(conversationId, senderId);
  const recipientIds = participantIds.filter((participantId) => participantId !== normalizeId(senderId));

  if ((conversation.kind ?? conversation.type) !== "support") {
    await assertNoBlockedRelationship(senderId, participantIds);
  }

  const message = await Message.create({
    attachments: normalizeAttachments(attachments),
    conversationId,
    deliveredTo: [senderId],
    readBy: [senderId],
    receiverIds: recipientIds,
    senderId,
    text: sanitizeMessageText(text).trim(),
    type: normalizeAttachments(attachments).length > 0 && !String(text ?? "").trim()
      ? "file"
      : "text",
  });

  const unreadIncrements = Object.fromEntries(
    recipientIds.map((recipientId) => [`unreadCounts.${recipientId}`, 1]),
  );
  const conversationUpdate = {
    $set: {
      lastMessage: message._id,
      lastMessageAt: message.createdAt,
      updatedAt: new Date(),
    },
  };

  if (Object.keys(unreadIncrements).length > 0) {
    conversationUpdate.$inc = unreadIncrements;
  }

  await Conversation.findByIdAndUpdate(conversationId, conversationUpdate);

  const [savedMessage, savedConversation] = await Promise.all([
    Message.findById(message._id).lean(),
    populateConversation(Conversation.findById(conversationId)),
  ]);
  const sender = await User.findById(senderId).select(userSelect).lean();
  const notifications = await notifyNewMessage({
    conversationId,
    message: savedMessage,
    recipientIds,
    sender: serializeUser(sender),
  });

  return {
    conversation: serializeConversation(savedConversation),
    message: serializeMessage(savedMessage),
    notifications,
    participantIds,
  };
}

export async function uploadMessageAttachmentsForUser(user, { baseUrl = "", files = [] } = {}) {
  ensureDatabaseConnection();

  if (!user?.id) {
    throw new AppError("Authentication required", 401);
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new AppError("At least one attachment is required", 400);
  }

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const cloudinaryUpload = await uploadMessageAsset({
        file,
        userId: user.id,
      });

      return {
        mimeType: file.mimetype ?? "",
        name: file.originalname ?? file.filename ?? "Attachment",
        fileName: file.originalname ?? file.filename ?? "Attachment",
        fileType: file.mimetype ?? "",
        provider: cloudinaryUpload ? "cloudinary" : "local",
        publicId: cloudinaryUpload?.publicId ?? "",
        size: cloudinaryUpload?.bytes ?? file.size,
        type: getAttachmentType(file),
        url: cloudinaryUpload?.secureUrl ?? buildLocalUploadUrl(file, "messages", baseUrl),
      };
    }),
  );

  return { items: uploaded };
}

export async function markConversationRead({ conversationId, readerId }) {
  const { participantIds } = await assertConversationAccess(conversationId, readerId);

  const result = await Message.updateMany(
    {
      conversationId,
      readBy: { $ne: readerId },
      senderId: { $ne: readerId },
    },
    {
      $addToSet: { readBy: readerId },
    },
  );

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      [`unreadCounts.${readerId}`]: 0,
    },
  });

  return {
    conversationId,
    modifiedCount: result.modifiedCount ?? 0,
    participantIds,
    readerId,
    readAt: new Date(),
  };
}

export async function markMessageAsRead({ messageId, readerId }) {
  ensureDatabaseConnection();
  assertObjectId(messageId, "message id");
  assertObjectId(readerId, "reader id");

  const message = await Message.findById(messageId).lean();

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  const { participantIds } = await assertConversationAccess(message.conversationId, readerId);
  const updated = await Message.findOneAndUpdate(
    {
      _id: messageId,
      readBy: { $ne: readerId },
    },
    {
      $addToSet: { readBy: readerId },
    },
    { new: true, runValidators: true },
  ).lean();

  await Conversation.findByIdAndUpdate(message.conversationId, {
    $set: {
      [`unreadCounts.${readerId}`]: 0,
    },
  });

  return {
    conversationId: normalizeId(message.conversationId),
    message: serializeMessage(updated ?? message),
    participantIds,
    readerId,
    readAt: new Date(),
  };
}

export async function softDeleteMessageForUser({ messageId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(messageId, "message id");
  assertObjectId(userId, "user id");

  const message = await Message.findById(messageId).lean();

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  await assertConversationAccess(message.conversationId, userId);

  const update =
    normalizeId(message.senderId) === normalizeId(userId)
      ? { $set: { isDeleted: true, text: "", attachments: [] } }
      : { $addToSet: { deletedFor: userId } };
  const updated = await Message.findByIdAndUpdate(messageId, update, {
    new: true,
    runValidators: true,
  }).lean();

  return serializeMessage(updated);
}

export const getUserConversations = findConversationsForUser;
export const createOrGetDirectConversation = ({ targetUserId, userId }) =>
  findOrCreateConversation({
    createdBy: userId,
    kind: "direct",
    participantIds: [userId, targetUserId],
  });
export const createOrGetSupportConversation = findOrCreateAdminConversation;
export const getConversationMessages = findMessagesForConversation;
export const sendMessage = ({ conversationId, payload, userId }) =>
  createConversationMessage({
    attachments: payload?.attachments,
    conversationId,
    senderId: userId,
    text: payload?.text,
  });
export const updateConversationLastMessage = async (conversationId, message) =>
  Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      lastMessage: message?._id ?? message,
      lastMessageAt: message?.createdAt ?? new Date(),
      updatedAt: new Date(),
    },
  });
