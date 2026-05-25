import { Router } from "express";
import {
  deleteMessage,
  getConversationMessages,
  getMyConversations,
  getOnlineStatus,
  readConversation,
  readMessage,
  sendConversationMessage,
  startAdminConversation,
  startConversation,
  startDirectConversation,
  uploadMessageAttachments,
} from "../controllers/messageController.js";
import { protectMessaging } from "../middleware/messagingAuthMiddleware.js";
import { permissions, requirePermission } from "../middleware/roleMiddleware.js";
import { messageRateLimiter, uploadRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { uploadMessageAttachments as uploadMessageAttachmentFiles } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(protectMessaging);
router.use(requirePermission(permissions.MESSAGES_USE));

router.get("/conversations", getMyConversations);
router.post("/conversations", startConversation);
router.post("/conversations/direct", startDirectConversation);
router.post("/conversations/admin", startAdminConversation);
router.post(
  "/attachments",
  uploadRateLimiter,
  uploadMessageAttachmentFiles,
  uploadMessageAttachments,
);
router.post("/presence", getOnlineStatus);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.post("/conversations/:conversationId/messages", messageRateLimiter, sendConversationMessage);
router.patch("/conversations/:conversationId/read", readConversation);
router.patch("/:messageId/read", readMessage);
router.delete("/:messageId", deleteMessage);

export default router;
