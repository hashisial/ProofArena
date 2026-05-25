import mongoose from "mongoose";
import {
  Notification,
  notificationEventTypes,
  notificationTypes,
} from "../models/Notification.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

export const notificationEvents = Object.freeze({
  CAMPAIGN_UPDATE: "campaign_update",
  CONNECTION_REQUEST: "connection_request",
  CONNECTION_ACCEPTED: "connection_accepted",
  NEW_MESSAGE: "new_message",
  NEW_PROPOSAL: "new_proposal",
  PAYMENT_UPDATE: "payment_update",
  PROJECT_UPDATE: "project_update",
  SERVICE_UPDATE: "service_update",
  ADMIN_UPDATE: "admin_update",
  SYSTEM_UPDATE: "system_update",
});

const eventDefaults = Object.freeze({
  [notificationEvents.CAMPAIGN_UPDATE]: {
    entityType: "campaign",
    title: "Campaign update",
    type: "campaign",
  },
  [notificationEvents.CONNECTION_REQUEST]: {
    actionUrl: "/connections",
    entityType: "connection",
    title: "Connection request",
    type: "connection",
  },
  [notificationEvents.CONNECTION_ACCEPTED]: {
    actionUrl: "/connections",
    entityType: "connection",
    title: "Connection accepted",
    type: "connection",
  },
  [notificationEvents.NEW_MESSAGE]: {
    actionUrl: "/messages",
    entityType: "message",
    title: "New message",
    type: "message",
  },
  [notificationEvents.NEW_PROPOSAL]: {
    actionUrl: "/projects",
    entityType: "proposal",
    title: "New proposal",
    type: "proposal",
  },
  [notificationEvents.PAYMENT_UPDATE]: {
    actionUrl: "/settings",
    entityType: "payment",
    title: "Payment update",
    type: "payment",
  },
  [notificationEvents.PROJECT_UPDATE]: {
    actionUrl: "/projects",
    entityType: "project",
    title: "Project update",
    type: "project",
  },
  [notificationEvents.SERVICE_UPDATE]: {
    actionUrl: "/provider-services",
    entityType: "service",
    title: "Service update",
    type: "service_update",
  },
  [notificationEvents.ADMIN_UPDATE]: {
    actionUrl: "/notifications",
    entityType: "system",
    title: "Admin update",
    type: "admin",
  },
  [notificationEvents.SYSTEM_UPDATE]: {
    entityType: "system",
    title: "System update",
    type: "system",
  },
});

function normalizeId(value) {
  return value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
}

function uniqueIds(values) {
  return Array.from(new Set(values.map(normalizeId).filter(Boolean)));
}

function normalizeEventType(eventType) {
  return notificationEventTypes.includes(eventType)
    ? eventType
    : notificationEvents.SYSTEM_UPDATE;
}

function normalizeType(type) {
  return notificationTypes.includes(type) ? type : "system";
}

function serializeNotification(notification) {
  if (!notification) {
    return null;
  }

  return {
    _id: normalizeId(notification._id),
    actionUrl: notification.actionUrl ?? "",
    createdAt: notification.createdAt,
    entityId: notification.entityId ? normalizeId(notification.entityId) : null,
    entityType: notification.entityType ?? "system",
    eventType: notification.eventType ?? notificationEvents.SYSTEM_UPDATE,
    message: notification.message ?? "",
    metadata: notification.metadata ?? {},
    isRead: Boolean(notification.read),
    read: Boolean(notification.read),
    title: notification.title ?? "Notification",
    type: notification.type ?? "system",
    updatedAt: notification.updatedAt,
    userId: normalizeId(notification.userId),
  };
}

function buildNotificationPayload(payload = {}) {
  const eventType = normalizeEventType(payload.eventType);
  const defaults = eventDefaults[eventType] ?? eventDefaults.system_update;
  const type = normalizeType(payload.type ?? defaults.type);
  const entityType = payload.entityType ?? defaults.entityType ?? "system";
  const message = String(payload.message ?? "").trim();
  const title = String(payload.title ?? defaults.title ?? "Notification").trim();

  if (!message) {
    throw new AppError("Notification message is required", 400);
  }

  return {
    actionUrl: String(payload.actionUrl ?? defaults.actionUrl ?? "").trim().slice(0, 500),
    entityId:
      payload.entityId && mongoose.Types.ObjectId.isValid(payload.entityId)
        ? payload.entityId
        : null,
    entityType,
    eventType,
    message: message.slice(0, 600),
    metadata: payload.metadata ?? {},
    title: title.slice(0, 160),
    type,
  };
}

export async function createNotification(payload = {}) {
  ensureDatabaseConnection();
  assertObjectId(payload.userId, "user id");

  const notification = await Notification.create({
    ...buildNotificationPayload(payload),
    userId: payload.userId,
  });

  return serializeNotification(notification.toObject());
}

export async function createNotifications(userIds = [], payload = {}) {
  ensureDatabaseConnection();

  const ids = uniqueIds(userIds);

  if (ids.length === 0) {
    return [];
  }

  ids.forEach((userId) => assertObjectId(userId, "user id"));

  const notificationPayload = buildNotificationPayload(payload);
  const notifications = await Notification.insertMany(
    ids.map((userId) => ({
      ...notificationPayload,
      userId,
    })),
    { ordered: false },
  );

  return notifications.map((notification) =>
    serializeNotification(notification.toObject()),
  );
}

export async function listNotificationsForUser(
  userId,
  { limit = 40, type = "", unreadOnly = false } = {},
) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");

  const safeLimit = Math.min(Math.max(Number(limit) || 40, 1), 100);
  const query = {
    userId,
    ...(unreadOnly ? { read: false } : {}),
  };

  if (type && notificationTypes.includes(type)) {
    query.type = type;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean();

  return notifications.map(serializeNotification);
}

export async function countUnreadNotifications(userId) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");

  return Notification.countDocuments({ read: false, userId });
}

export async function markNotificationReadForUser(userId, notificationId) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");
  assertObjectId(notificationId, "notification id");

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { read: true } },
    { new: true, runValidators: true },
  ).lean();

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return serializeNotification(notification);
}

export async function markAllNotificationsReadForUser(userId) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");

  const result = await Notification.updateMany(
    { read: false, userId },
    { $set: { read: true } },
  );

  return {
    modifiedCount: result.modifiedCount ?? 0,
  };
}

export async function deleteNotificationForUser(userId, notificationId) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");
  assertObjectId(notificationId, "notification id");

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  }).lean();

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return {
    _id: normalizeId(notification._id),
    deleted: true,
  };
}

export async function notifyNewMessage({
  conversationId,
  message,
  recipientIds,
  sender,
}) {
  const senderLabel = sender?.fullName || sender?.name || "A teammate";
  const preview = String(message?.text ?? "").trim();

  return createNotifications(recipientIds, {
    actionUrl: "/messages",
    entityId: message?._id,
    entityType: "message",
    eventType: notificationEvents.NEW_MESSAGE,
    message: preview
      ? `${senderLabel}: ${preview.slice(0, 120)}`
      : `${senderLabel} sent an attachment.`,
    metadata: {
      conversationId,
      senderId: sender?.id ?? sender?._id ?? "",
    },
    title: "New message",
    type: "message",
  });
}

export async function notifyNewProposal({
  bidAmount,
  clientId,
  projectId,
  proposalId,
  providerName = "A provider",
}) {
  return createNotification({
    actionUrl: "/projects",
    entityId: proposalId,
    entityType: "proposal",
    eventType: notificationEvents.NEW_PROPOSAL,
    message: `${providerName} sent a proposal${bidAmount ? ` for $${bidAmount}` : ""}.`,
    metadata: {
      projectId,
      proposalId,
    },
    title: "New proposal received",
    type: "proposal",
    userId: clientId,
  });
}

export async function notifyConnectionRequest({
  connectionId,
  receiverId,
  senderName = "A user",
}) {
  return createNotification({
    actionUrl: "/connections",
    entityId: connectionId,
    entityType: "connection",
    eventType: notificationEvents.CONNECTION_REQUEST,
    message: `${senderName} wants to connect with you.`,
    title: "Connection request",
    type: "connection",
    userId: receiverId,
  });
}

export async function notifyConnectionAccepted({
  connectionId,
  receiverId,
  senderName = "A user",
}) {
  return createNotification({
    actionUrl: "/connections",
    entityId: connectionId,
    entityType: "connection",
    eventType: notificationEvents.CONNECTION_ACCEPTED,
    message: `${senderName} accepted your connection request.`,
    title: "Connection accepted",
    type: "connection",
    userId: receiverId,
  });
}

export async function notifyProjectUpdate({
  message,
  projectId,
  recipientIds,
  status,
  title = "Project update",
}) {
  return createNotifications(recipientIds, {
    actionUrl: "/projects",
    entityId: projectId,
    entityType: "project",
    eventType: notificationEvents.PROJECT_UPDATE,
    message: message || `Project status updated${status ? ` to ${status}` : ""}.`,
    metadata: {
      projectId,
      status,
    },
    title,
    type: "project",
  });
}

export async function notifyPaymentUpdate({
  amount,
  currency,
  invoiceId,
  status,
  subscriptionId,
  title = "Billing update",
  userId,
}) {
  let amountLabel = "";
  const numericAmount = Number(amount);
  const currencyCode = String(currency ?? "usd").toUpperCase();

  if (Number.isFinite(numericAmount) && numericAmount > 0) {
    try {
      amountLabel = new Intl.NumberFormat("en", {
        currency: currencyCode,
        style: "currency",
      }).format(numericAmount / 100);
    } catch {
      amountLabel = `${numericAmount / 100} ${currencyCode}`;
    }
  }

  return createNotification({
    actionUrl: "/settings",
    entityId: invoiceId ?? subscriptionId,
    entityType: invoiceId ? "invoice" : "subscription",
    eventType: notificationEvents.PAYMENT_UPDATE,
    message: `Your billing status is ${status ?? "updated"}.${amountLabel ? ` Amount: ${amountLabel}.` : ""}`,
    metadata: {
      invoiceId,
      status,
      subscriptionId,
    },
    title,
    type: "payment",
    userId,
  });
}
