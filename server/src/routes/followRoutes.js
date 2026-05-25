import { Router } from "express";
import {
  followUser,
  getFollowStatus,
  unfollowUser,
} from "../controllers/followController.js";
import { protectMessaging } from "../middleware/messagingAuthMiddleware.js";
import { permissions, requirePermission } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protectMessaging);
router.use(requirePermission(permissions.NETWORK_USE));

router.get("/status/:userId", getFollowStatus);
router.post("/:userId", followUser);
router.delete("/:userId", unfollowUser);

export default router;
