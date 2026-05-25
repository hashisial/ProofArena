import {
  createConversationMessage,
  findConversationsForUser,
  findMessagesForConversation,
  findOrCreateAdminConversation,
  findOrCreateConversation,
  markConversationRead,
  markMessageAsRead,
  softDeleteMessageForUser,
  uploadMessageAttachmentsForUser,
} from "../services/messagingService.js";
import {
  emitConversationEvent,
  emitUserEvent,
  getPresenceForUsers,
} from "../services/socketService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyConversations = asyncHandler(async (request, response) => {
  const conversations = await findConversationsForUser(request.user.id);
  sendSuccess(response, { items: conversations });
});

export const startConversation = asyncHandler(async (request, response) => {
  const participantIds = Array.isArray(request.body?.participantIds)
    ? request.body.participantIds
    : [request.body?.participantId];
  const conversation = await findOrCreateConversation({
    createdBy: request.user.id,
    participantIds: [request.user.id, ...participantIds],
  });

  sendSuccess(response, conversation, 201);
});

export const startDirectConversation = asyncHandler(async (request, response) => {
  const targetUserId = request.body?.targetUserId ?? request.body?.participantId;
  const conversation = await findOrCreateConversation({
    createdBy: request.user.id,
    kind: "direct",
    participantIds: [request.user.id, targetUserId],
  });

  sendSuccess(response, conversation, 201);
});

export const startAdminConversation = asyncHandler(async (request, response) => {
  const conversation = await findOrCreateAdminConversation(request.user.id);

  sendSuccess(response, conversation, 201);
});

export const getConversationMessages = asyncHandler(async (request, response) => {
  const messages = await findMessagesForConversation({
    conversationId: request.params.conversationId,
    limit: request.query.limit,
    page: request.query.page,
    userId: request.user.id,
  });

  sendSuccess(response, { items: messages });
});

export const sendConversationMessage = asyncHandler(async (request, response) => {
  const result = await createConversationMessage({
    attachments: request.body?.attachments,
    conversationId: request.params.conversationId,
    senderId: request.user.id,
    text: request.body?.text,
  });

  emitConversationEvent(result.participantIds, result.message.conversationId, "message:new", {
    conversation: result.conversation,
    message: result.message,
  });
  result.notifications?.forEach((notification) => {
    emitUserEvent(notification.userId, "notification:new", notification);
  });
  sendSuccess(response, result, 201);
});

export const readConversation = asyncHandler(async (request, response) => {
  const receipt = await markConversationRead({
    conversationId: request.params.conversationId,
    readerId: request.user.id,
  });

  emitConversationEvent(receipt.participantIds, receipt.conversationId, "message:read", receipt);
  sendSuccess(response, receipt);
});

export const readMessage = asyncHandler(async (request, response) => {
  const receipt = await markMessageAsRead({
    messageId: request.params.messageId,
    readerId: request.user.id,
  });

  emitConversationEvent(receipt.participantIds, receipt.conversationId, "message:read", receipt);
  sendSuccess(response, receipt);
});

export const deleteMessage = asyncHandler(async (request, response) => {
  const message = await softDeleteMessageForUser({
    messageId: request.params.messageId,
    userId: request.user.id,
  });

  sendSuccess(response, message);
});

export const getOnlineStatus = asyncHandler(async (request, response) => {
  const userIds = Array.isArray(request.body?.userIds) ? request.body.userIds : [];
  const statuses = getPresenceForUsers(userIds);

  sendSuccess(response, { items: statuses });
});

export const uploadMessageAttachments = asyncHandler(async (request, response) => {
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  const uploads = await uploadMessageAttachmentsForUser(request.user, {
    baseUrl,
    files: request.files ?? [],
  });

  sendSuccess(response, uploads, 201);
});
