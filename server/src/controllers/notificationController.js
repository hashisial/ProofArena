import {
  countUnreadNotifications,
  deleteNotificationForUser,
  listNotificationsForUser,
  markAllNotificationsReadForUser,
  markNotificationReadForUser,
} from "../services/notificationService.js";
import { emitUserEvent } from "../services/socketService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function emitNotificationCount(userId) {
  const count = await countUnreadNotifications(userId);
  emitUserEvent(userId, "notification:count:update", { count });
}

export const getMyNotifications = asyncHandler(async (request, response) => {
  const notifications = await listNotificationsForUser(request.user.id, {
    limit: request.query.limit,
    type: request.query.type,
    unreadOnly: request.query.unreadOnly === "true",
  });

  sendSuccess(response, { items: notifications });
});

export const getMyUnreadNotificationCount = asyncHandler(async (request, response) => {
  const count = await countUnreadNotifications(request.user.id);

  sendSuccess(response, { count });
});

export const readNotification = asyncHandler(async (request, response) => {
  const notification = await markNotificationReadForUser(
    request.user.id,
    request.params.notificationId,
  );

  emitUserEvent(request.user.id, "notification:read", notification);
  await emitNotificationCount(request.user.id);
  sendSuccess(response, notification);
});

export const readAllNotifications = asyncHandler(async (request, response) => {
  const result = await markAllNotificationsReadForUser(request.user.id);

  await emitNotificationCount(request.user.id);
  sendSuccess(response, result);
});

export const deleteNotification = asyncHandler(async (request, response) => {
  const result = await deleteNotificationForUser(
    request.user.id,
    request.params.notificationId,
  );

  await emitNotificationCount(request.user.id);
  sendSuccess(response, result);
});
