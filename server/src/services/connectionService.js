import mongoose from "mongoose";
import { Connection } from "../models/Connection.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import {
  notifyConnectionAccepted,
  notifyConnectionRequest,
} from "./notificationService.js";

const userSelect = "_id accountType avatar fullName isSuspended name role username";
const validConnectionStatuses = new Set(["pending", "accepted", "rejected", "blocked"]);

function escapeRegex(value) {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

function serializeUser(user, publicProfile) {
  if (!user) {
    return null;
  }

  const fullName = user.fullName ?? user.name ?? "";

  return {
    _id: normalizeId(user._id),
    accountType: user.accountType ?? "individual",
    avatar: user.avatar || publicProfile?.profilePicture || "",
    fullName,
    headline: publicProfile?.headline ?? "",
    id: normalizeId(user._id),
    location: publicProfile?.location ?? "",
    name: user.name ?? fullName,
    publicUrl: user.username
      ? user.role === "provider"
        ? `/providers/${user.username}`
        : `/u/${user.username}`
      : "",
    role: user.role === "user" ? "client" : user.role,
    username: user.username ?? "",
  };
}

function isPublicProfile(profile) {
  return (profile?.profileVisibility ?? "public") === "public";
}

async function assertPublicConnectionTarget(userId) {
  const profile = await UserProfile.findOne({ userId })
    .select("profileVisibility")
    .lean();

  if (!isPublicProfile(profile)) {
    throw new AppError("Connection target is unavailable", 404);
  }
}

function getOtherUserId(connection, userId) {
  const senderId = normalizeId(connection.senderId?._id ?? connection.senderId);
  const receiverId = normalizeId(connection.receiverId?._id ?? connection.receiverId);

  return senderId === normalizeId(userId) ? receiverId : senderId;
}

async function hydrateConnections(connections, viewerId) {
  const userIds = Array.from(
    new Set(
      connections
        .flatMap((connection) => [
          normalizeId(connection.senderId?._id ?? connection.senderId),
          normalizeId(connection.receiverId?._id ?? connection.receiverId),
        ])
        .filter(Boolean),
    ),
  );
  const [users, profiles] = await Promise.all([
    userIds.length
      ? User.find({ _id: { $in: userIds } }).select(userSelect).lean()
      : [],
    userIds.length ? UserProfile.find({ userId: { $in: userIds } }).lean() : [],
  ]);
  const profilesByUserId = new Map(
    profiles.map((profile) => [normalizeId(profile.userId), profile]),
  );
  const usersById = new Map(
    users.map((user) => [
      normalizeId(user._id),
      serializeUser(user, profilesByUserId.get(normalizeId(user._id))),
    ]),
  );

  return connections.map((connection) => {
    const senderId = normalizeId(connection.senderId?._id ?? connection.senderId);
    const receiverId = normalizeId(connection.receiverId?._id ?? connection.receiverId);
    const otherUserId = getOtherUserId(connection, viewerId);

    return {
      _id: normalizeId(connection._id),
      blockedBy: connection.blockedBy ? normalizeId(connection.blockedBy) : null,
      createdAt: connection.createdAt,
      direction: senderId === normalizeId(viewerId) ? "sent" : "received",
      otherUser: usersById.get(otherUserId) ?? { id: otherUserId },
      receiver: usersById.get(receiverId) ?? { id: receiverId },
      receiverId,
      recipientId: receiverId,
      requesterId: senderId,
      sender: usersById.get(senderId) ?? { id: senderId },
      senderId,
      status: connection.status,
      updatedAt: connection.updatedAt,
    };
  });
}

export async function listConnectionsForUser(userId, filters = {}) {
  ensureDatabaseConnection();
  assertObjectId(userId, "User id");

  const status = String(filters.status ?? "").trim();
  const direction = String(filters.direction ?? "").trim();
  const query = {};

  if (status) {
    if (!validConnectionStatuses.has(status)) {
      throw new AppError("Connection status is invalid", 400);
    }

    query.status = status;
  }

  if (direction === "sent") {
    query.senderId = userId;
  } else if (direction === "received") {
    query.receiverId = userId;
  } else {
    query.$or = [{ senderId: userId }, { receiverId: userId }];
  }

  const connections = await Connection.find(query)
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(100)
    .lean();

  return hydrateConnections(connections, userId);
}

export async function searchConnectionCandidatesForUser(userId, filters = {}) {
  ensureDatabaseConnection();
  assertObjectId(userId, "User id");

  const q = String(filters.q ?? "").trim();
  const safeLimit = Math.min(Math.max(Number(filters.limit) || 12, 1), 24);
  const query = {
    _id: { $ne: userId },
    isSuspended: { $ne: true },
    role: { $in: ["client", "provider", "user"] },
  };

  if (q) {
    const regex = new RegExp(escapeRegex(q), "i");
    const matchingProfiles = await UserProfile.find({
      $or: [
        { company: regex },
        { headline: regex },
        { location: regex },
        { skills: regex },
      ],
    })
      .select("userId")
      .limit(50)
      .lean();
    const profileUserIds = matchingProfiles.map((profile) => profile.userId);

    query.$or = [
      { email: regex },
      { fullName: regex },
      { name: regex },
      { username: regex },
      ...(profileUserIds.length ? [{ _id: { $in: profileUserIds } }] : []),
    ];
  }

  const users = await User.find(query)
    .select(userSelect)
    .sort({ role: -1, createdAt: -1 })
    .limit(safeLimit)
    .lean();
  const userIds = users.map((user) => normalizeId(user._id));
  const [profiles, connections] = await Promise.all([
    userIds.length ? UserProfile.find({ userId: { $in: userIds } }).lean() : [],
    userIds.length
      ? Connection.find({
          $or: [
            { receiverId: { $in: userIds }, senderId: userId },
            { receiverId: userId, senderId: { $in: userIds } },
          ],
        }).lean()
      : [],
  ]);
  const profilesByUserId = new Map(
    profiles.map((profile) => [normalizeId(profile.userId), profile]),
  );
  const connectionsByOtherUserId = new Map(
    connections.map((connection) => [
      getOtherUserId(connection, userId),
      {
        _id: normalizeId(connection._id),
        direction:
          normalizeId(connection.senderId) === normalizeId(userId) ? "sent" : "received",
        status: connection.status,
      },
    ]),
  );

  return users
    .filter((user) => isPublicProfile(profilesByUserId.get(normalizeId(user._id))))
    .map((user) => {
    const serialized = serializeUser(user, profilesByUserId.get(normalizeId(user._id)));
    const connection = connectionsByOtherUserId.get(normalizeId(user._id)) ?? null;

    return {
      ...serialized,
      connection,
      connectionStatus: connection?.status ?? "none",
    };
  });
}

export async function listConnectionSuggestionsForUser(userId, filters = {}) {
  const candidates = await searchConnectionCandidatesForUser(userId, {
    ...filters,
    limit: filters.limit ?? 18,
  });

  return candidates.filter((candidate) =>
    ["none", "rejected"].includes(candidate.connectionStatus),
  );
}

export async function requestConnection({ receiverId, sender }) {
  ensureDatabaseConnection();

  if (!sender?.id) {
    throw new AppError("Authentication required", 401);
  }

  assertObjectId(sender.id, "Sender id");
  assertObjectId(receiverId, "Receiver id");

  if (normalizeId(sender.id) === normalizeId(receiverId)) {
    throw new AppError("Users cannot connect with themselves", 400);
  }

  const receiver = await User.findOne({
    _id: receiverId,
    isSuspended: { $ne: true },
  })
    .select(userSelect)
    .lean();

  if (!receiver) {
    throw new AppError("Connection target is unavailable", 404);
  }

  await assertPublicConnectionTarget(receiverId);

  const existing = await Connection.findOne({
    $or: [
      { receiverId, senderId: sender.id },
      { receiverId: sender.id, senderId: receiverId },
    ],
  });

  if (existing) {
    if (existing.status === "blocked") {
      throw new AppError("This user is blocked for connections", 403);
    }

    if (existing.status === "rejected") {
      existing.status = "pending";
      existing.senderId = sender.id;
      existing.receiverId = receiverId;
      await existing.save();
    }

    const [serialized] = await hydrateConnections([existing.toObject()], sender.id);
    return { connection: serialized, notifications: [] };
  }

  const connection = await Connection.create({
    receiverId,
    senderId: sender.id,
    status: "pending",
  });
  const notification = await notifyConnectionRequest({
    connectionId: connection._id,
    receiverId,
    senderName: sender.fullName || sender.name || "A user",
  });
  const [serialized] = await hydrateConnections([connection.toObject()], sender.id);

  return { connection: serialized, notifications: [notification] };
}

export async function getConnectionStatusForUser({ targetUserId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(userId, "User id");
  assertObjectId(targetUserId, "Target user id");

  if (normalizeId(userId) === normalizeId(targetUserId)) {
    return {
      connection: null,
      status: "self",
    };
  }

  const target = await User.findOne({
    _id: targetUserId,
    isSuspended: { $ne: true },
  }).select("_id").lean();

  if (!target) {
    throw new AppError("Connection target is unavailable", 404);
  }

  await assertPublicConnectionTarget(targetUserId);

  const connection = await Connection.findOne({
    $or: [
      { receiverId: targetUserId, senderId: userId },
      { receiverId: userId, senderId: targetUserId },
    ],
  }).lean();

  if (!connection) {
    return {
      connection: null,
      status: "none",
    };
  }

  const [serialized] = await hydrateConnections([connection], userId);

  if (connection.status === "accepted") {
    return {
      connection: serialized,
      status: "connected",
    };
  }

  if (connection.status === "pending") {
    return {
      connection: serialized,
      status:
        normalizeId(connection.senderId) === normalizeId(userId)
          ? "pending_sent"
          : "pending_received",
    };
  }

  return {
    connection: serialized,
    status: connection.status || "none",
  };
}

export async function deleteConnectionWithUserForUser({ targetUserId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(userId, "User id");
  assertObjectId(targetUserId, "Target user id");

  const connection = await Connection.findOneAndDelete({
    $or: [
      { receiverId: targetUserId, senderId: userId },
      { receiverId: userId, senderId: targetUserId },
    ],
  }).lean();

  if (!connection) {
    throw new AppError("Connection not found", 404);
  }

  return {
    _id: normalizeId(connection._id),
    deleted: true,
    status: "none",
  };
}

export async function updateConnectionForUser({ connectionId, status, user }) {
  ensureDatabaseConnection();

  if (!user?.id) {
    throw new AppError("Authentication required", 401);
  }

  assertObjectId(connectionId, "Connection id");

  if (!["accepted", "rejected"].includes(status)) {
    throw new AppError("Connection status must be accepted or rejected", 400);
  }

  const connection = await Connection.findOne({
    _id: connectionId,
    receiverId: user.id,
  });

  if (!connection) {
    throw new AppError("Connection request not found", 404);
  }

  connection.status = status;
  await connection.save();

  const notifications = [];

  if (status === "accepted") {
    const notification = await notifyConnectionAccepted({
      connectionId: connection._id,
      receiverId: connection.senderId,
      senderName: user.fullName || user.name || "A user",
    });
    notifications.push(notification);
  }

  const [serialized] = await hydrateConnections([connection.toObject()], user.id);

  return { connection: serialized, notifications };
}

export async function deleteConnectionForUser({ connectionId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(connectionId, "Connection id");
  assertObjectId(userId, "User id");

  const connection = await Connection.findOneAndDelete({
    _id: connectionId,
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).lean();

  if (!connection) {
    throw new AppError("Connection not found", 404);
  }

  return {
    _id: normalizeId(connection._id),
    deleted: true,
  };
}

export async function blockUserForUser({ targetUserId, user }) {
  ensureDatabaseConnection();

  if (!user?.id) {
    throw new AppError("Authentication required", 401);
  }

  assertObjectId(user.id, "User id");
  assertObjectId(targetUserId, "Target user id");

  if (normalizeId(user.id) === normalizeId(targetUserId)) {
    throw new AppError("Users cannot block themselves", 400);
  }

  const target = await User.findOne({
    _id: targetUserId,
    isSuspended: { $ne: true },
  })
    .select("_id")
    .lean();

  if (!target) {
    throw new AppError("User is unavailable", 404);
  }

  const existing = await Connection.findOne({
    $or: [
      { receiverId: targetUserId, senderId: user.id },
      { receiverId: user.id, senderId: targetUserId },
    ],
  });
  const connection =
    existing ??
    new Connection({
      receiverId: targetUserId,
      senderId: user.id,
    });

  connection.blockedBy = user.id;
  connection.status = "blocked";
  await connection.save();

  const [serialized] = await hydrateConnections([connection.toObject()], user.id);

  return serialized;
}

export async function isRelationshipBlocked(userId, targetUserId) {
  ensureDatabaseConnection();

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
    return true;
  }

  return Boolean(
    await Connection.exists({
      status: "blocked",
      $or: [
        { receiverId: targetUserId, senderId: userId },
        { receiverId: userId, senderId: targetUserId },
      ],
    }),
  );
}
