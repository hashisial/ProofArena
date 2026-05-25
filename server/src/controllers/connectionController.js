import {
  blockUserForUser,
  deleteConnectionForUser,
  deleteConnectionWithUserForUser,
  getConnectionStatusForUser,
  listConnectionsForUser,
  listConnectionSuggestionsForUser,
  requestConnection,
  searchConnectionCandidatesForUser,
  updateConnectionForUser,
} from "../services/connectionService.js";
import { emitUserEvent } from "../services/socketService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function emitNotifications(notifications = []) {
  notifications.forEach((notification) => {
    emitUserEvent(notification.userId, "notification:new", notification);
  });
}

function emitConnectionUpdate(connection) {
  if (!connection) {
    return;
  }

  [connection.senderId, connection.receiverId].forEach((userId) => {
    emitUserEvent(userId, "connection:updated", connection);
  });
}

export const getMyConnections = asyncHandler(async (request, response) => {
  const connections = await listConnectionsForUser(request.user.id, request.query ?? {});
  sendSuccess(response, { items: connections });
});

export const getAcceptedConnections = asyncHandler(async (request, response) => {
  const connections = await listConnectionsForUser(request.user.id, {
    ...request.query,
    status: "accepted",
  });

  sendSuccess(response, { items: connections });
});

export const getReceivedConnectionRequests = asyncHandler(async (request, response) => {
  const connections = await listConnectionsForUser(request.user.id, {
    direction: "received",
    status: "pending",
  });

  sendSuccess(response, { items: connections });
});

export const getSentConnectionRequests = asyncHandler(async (request, response) => {
  const connections = await listConnectionsForUser(request.user.id, {
    direction: "sent",
    status: "pending",
  });

  sendSuccess(response, { items: connections });
});

export const searchConnectionCandidates = asyncHandler(async (request, response) => {
  const candidates = await searchConnectionCandidatesForUser(
    request.user.id,
    request.query ?? {},
  );

  sendSuccess(response, { items: candidates });
});

export const getConnectionSuggestions = asyncHandler(async (request, response) => {
  const candidates = await listConnectionSuggestionsForUser(
    request.user.id,
    request.query ?? {},
  );

  sendSuccess(response, { items: candidates });
});

export const getConnectionStatus = asyncHandler(async (request, response) => {
  const status = await getConnectionStatusForUser({
    targetUserId: request.params.userId,
    userId: request.user.id,
  });

  sendSuccess(response, status);
});

export const postConnectionRequest = asyncHandler(async (request, response) => {
  const result = await requestConnection({
    receiverId: request.body?.receiverId,
    sender: request.user,
  });

  emitNotifications(result.notifications);
  emitConnectionUpdate(result.connection);
  sendSuccess(response, result.connection, 201);
});

export const postConnectionRequestToUser = asyncHandler(async (request, response) => {
  const result = await requestConnection({
    receiverId: request.params.userId,
    sender: request.user,
  });

  emitNotifications(result.notifications);
  emitConnectionUpdate(result.connection);
  sendSuccess(response, result.connection, 201);
});

export const patchConnectionStatus = asyncHandler(async (request, response) => {
  const result = await updateConnectionForUser({
    connectionId: request.params.connectionId,
    status: request.body?.status,
    user: request.user,
  });

  emitNotifications(result.notifications);
  emitConnectionUpdate(result.connection);
  sendSuccess(response, result.connection);
});

export const acceptConnection = asyncHandler(async (request, response) => {
  const result = await updateConnectionForUser({
    connectionId: request.params.connectionId,
    status: "accepted",
    user: request.user,
  });

  emitNotifications(result.notifications);
  emitConnectionUpdate(result.connection);
  sendSuccess(response, result.connection);
});

export const rejectConnection = asyncHandler(async (request, response) => {
  const result = await updateConnectionForUser({
    connectionId: request.params.connectionId,
    status: "rejected",
    user: request.user,
  });

  emitNotifications(result.notifications);
  emitConnectionUpdate(result.connection);
  sendSuccess(response, result.connection);
});

export const blockConnectionUser = asyncHandler(async (request, response) => {
  const connection = await blockUserForUser({
    targetUserId: request.params.userId,
    user: request.user,
  });

  emitConnectionUpdate(connection);
  sendSuccess(response, connection, 201);
});

export const deleteConnection = asyncHandler(async (request, response) => {
  const result = await deleteConnectionForUser({
    connectionId: request.params.connectionId,
    userId: request.user.id,
  });

  sendSuccess(response, result);
});

export const deleteConnectionWithUser = asyncHandler(async (request, response) => {
  const result = await deleteConnectionWithUserForUser({
    targetUserId: request.params.userId,
    userId: request.user.id,
  });

  sendSuccess(response, result);
});
