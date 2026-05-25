import { Router } from "express";
import {
  getNetworkComments,
  getNetworkFeed,
  likeNetworkPost,
  postNetworkComment,
  postNetworkUpdate,
  shareNetworkPost,
} from "../controllers/networkController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protectUser);
router.use(requireRole(roles.client, roles.provider));
router.use(requirePermission(permissions.NETWORK_USE));

router.get("/feed", getNetworkFeed);
router.post("/posts", postNetworkUpdate);
router.post("/posts/:postId/like", likeNetworkPost);
router.get("/posts/:postId/comments", getNetworkComments);
router.post("/posts/:postId/comments", postNetworkComment);
router.post("/posts/:postId/share", shareNetworkPost);

export default router;
