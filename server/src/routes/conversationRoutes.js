import { Router } from "express";
import {
  getConversationMessages,
  getMyConversations,
  readConversation,
  sendConversationMessage,
  startAdminConversation,
  startDirectConversation,
} from "../controllers/messageController.js";
import { protectMessaging } from "../middleware/messagingAuthMiddleware.js";
import { messageRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { permissions, requirePermission } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protectMessaging);
router.use(requirePermission(permissions.MESSAGES_USE));

router.get("/", getMyConversations);
router.post("/direct", startDirectConversation);
router.post("/support", startAdminConversation);
router.get("/:conversationId/messages", getConversationMessages);
router.post("/:conversationId/messages", messageRateLimiter, sendConversationMessage);
router.patch("/:conversationId/read", readConversation);

export default router;
