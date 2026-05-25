import { Router } from "express";
import {
  deleteNotification,
  getMyNotifications,
  getMyUnreadNotificationCount,
  readAllNotifications,
  readNotification,
} from "../controllers/notificationController.js";
import { protectMessaging } from "../middleware/messagingAuthMiddleware.js";
import { permissions, requirePermission } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protectMessaging);
router.use(requirePermission(permissions.NOTIFICATIONS_READ));

router.get("/", getMyNotifications);
router.get("/unread-count", getMyUnreadNotificationCount);
router.patch("/read-all", readAllNotifications);
router.patch("/:notificationId/read", readNotification);
router.delete("/:notificationId", deleteNotification);

export default router;
