import { Server } from "socket.io";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { getMessagingPrincipalFromToken } from "./messagingAuthService.js";
import {
  assertConversationAccess,
  createConversationMessage,
  markConversationRead,
} from "./messagingService.js";

let ioInstance = null;
const onlineUsers = new Map();

function isAllowedOrigin(origin) {
  if (!origin || env.clientUrls.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function userRoom(userId) {
  return `user:${userId}`;
}

function conversationRoom(conversationId) {
  return `conversation:${conversationId}`;
}

function incrementOnlineUser(userId) {
  const current = onlineUsers.get(userId) ?? 0;
  onlineUsers.set(userId, current + 1);
  return current === 0;
}

function decrementOnlineUser(userId) {
  const current = onlineUsers.get(userId) ?? 0;

  if (current <= 1) {
    onlineUsers.delete(userId);
    return true;
  }

  onlineUsers.set(userId, current - 1);
  return false;
}

function getSocketToken(socket) {
  return (
    socket.handshake.auth?.token ??
    socket.handshake.headers?.authorization ??
    ""
  );
}

function acknowledge(callback, payload) {
  if (typeof callback === "function") {
    callback(payload);
  }
}

function normalizeSocketError(error) {
  return {
    message: error?.message ?? "Realtime request failed",
    success: false,
  };
}

export function getPresenceForUsers(userIds = []) {
  return Array.from(new Set(userIds.map((userId) => String(userId ?? "")).filter(Boolean)))
    .map((userId) => ({
      online: onlineUsers.has(userId),
      userId,
    }));
}

export function emitConversationEvent(participantIds, conversationId, event, payload) {
  if (!ioInstance) {
    return;
  }

  const rooms = [
    conversationRoom(conversationId),
    ...participantIds.map(userRoom),
  ];

  ioInstance.to(rooms).emit(event, payload);

  if (event === "message:new") {
    ioInstance.to(rooms).emit("message:receive", payload);
    ioInstance.to(rooms).emit("conversation:update", {
      conversation: payload?.conversation,
    });
  }

  if (event === "typing:update") {
    ioInstance
      .to(rooms)
      .emit(payload?.isTyping ? "typing:start" : "typing:stop", payload);
  }
}

export function emitUserEvent(userId, event, payload) {
  if (!ioInstance || !userId) {
    return;
  }

  ioInstance.to(userRoom(userId)).emit(event, payload);
}

export function initializeSocketServer(server) {
  ioInstance = new Server(server, {
    cors: {
      credentials: false,
      methods: ["GET", "POST"],
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Socket.IO CORS blocked origin: ${origin}`));
      },
    },
  });

  ioInstance.use(async (socket, next) => {
    try {
      socket.data.user = await getMessagingPrincipalFromToken(
        getSocketToken(socket),
        { allowVirtualAdmin: true },
      );
      next();
    } catch (error) {
      next(error);
    }
  });

  ioInstance.on("connection", (socket) => {
    const principal = socket.data.user;

    if (principal.role === "admin") {
      socket.join("admins");
    }

    if (principal.id) {
      socket.join(userRoom(principal.id));

      if (incrementOnlineUser(principal.id)) {
        socket.broadcast.emit("presence:update", {
          online: true,
          userId: principal.id,
        });
        socket.broadcast.emit("user:online", {
          online: true,
          userId: principal.id,
        });
      }
    }

    socket.on("conversation:join", async ({ conversationId } = {}, callback) => {
      try {
        if (!principal.id) {
          throw new AppError("Persistent messaging requires a database-backed account", 403);
        }

        await assertConversationAccess(conversationId, principal.id);
        socket.join(conversationRoom(conversationId));
        acknowledge(callback, { success: true });
      } catch (error) {
        acknowledge(callback, normalizeSocketError(error));
      }
    });

    socket.on("conversation:leave", ({ conversationId } = {}) => {
      if (conversationId) {
        socket.leave(conversationRoom(conversationId));
      }
    });

    socket.on("typing:start", async ({ conversationId } = {}, callback) => {
      try {
        if (!principal.id) {
          throw new AppError("Persistent messaging requires a database-backed account", 403);
        }

        await assertConversationAccess(conversationId, principal.id);
        socket.to(conversationRoom(conversationId)).emit("typing:update", {
          conversationId,
          isTyping: true,
          user: principal,
          userId: principal.id,
        });
        acknowledge(callback, { success: true });
      } catch (error) {
        acknowledge(callback, normalizeSocketError(error));
      }
    });

    socket.on("typing:stop", async ({ conversationId } = {}, callback) => {
      try {
        if (!principal.id) {
          throw new AppError("Persistent messaging requires a database-backed account", 403);
        }

        await assertConversationAccess(conversationId, principal.id);
        socket.to(conversationRoom(conversationId)).emit("typing:update", {
          conversationId,
          isTyping: false,
          user: principal,
          userId: principal.id,
        });
        acknowledge(callback, { success: true });
      } catch (error) {
        acknowledge(callback, normalizeSocketError(error));
      }
    });

    socket.on("message:send", async (payload = {}, callback) => {
      try {
        if (!principal.id) {
          throw new AppError("Persistent messaging requires a database-backed account", 403);
        }

        const result = await createConversationMessage({
          attachments: payload.attachments,
          conversationId: payload.conversationId,
          senderId: principal.id,
          text: payload.text,
        });

        emitConversationEvent(
          result.participantIds,
          result.message.conversationId,
          "message:new",
          {
            conversation: result.conversation,
            message: result.message,
          },
        );
        result.notifications?.forEach((notification) => {
          emitUserEvent(notification.userId, "notification:new", notification);
        });
        acknowledge(callback, { data: result, success: true });
      } catch (error) {
        acknowledge(callback, normalizeSocketError(error));
      }
    });

    socket.on("message:read", async ({ conversationId } = {}, callback) => {
      try {
        if (!principal.id) {
          throw new AppError("Persistent messaging requires a database-backed account", 403);
        }

        const receipt = await markConversationRead({
          conversationId,
          readerId: principal.id,
        });

        emitConversationEvent(receipt.participantIds, receipt.conversationId, "message:read", receipt);
        acknowledge(callback, { data: receipt, success: true });
      } catch (error) {
        acknowledge(callback, normalizeSocketError(error));
      }
    });

    socket.on("presence:get", ({ userIds } = {}, callback) => {
      acknowledge(callback, {
        data: getPresenceForUsers(userIds),
        success: true,
      });
    });

    socket.on("disconnect", () => {
      if (principal.id && decrementOnlineUser(principal.id)) {
        socket.broadcast.emit("presence:update", {
          online: false,
          userId: principal.id,
        });
        socket.broadcast.emit("user:offline", {
          online: false,
          userId: principal.id,
        });
      }
    });
  });

  return ioInstance;
}

export function closeSocketServer() {
  if (!ioInstance) {
    return;
  }

  ioInstance.close();
  ioInstance = null;
  onlineUsers.clear();
}
