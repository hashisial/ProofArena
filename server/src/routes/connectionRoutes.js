import { Router } from "express";
import {
  acceptConnection,
  blockConnectionUser,
  deleteConnection,
  deleteConnectionWithUser,
  getAcceptedConnections,
  getConnectionStatus,
  getMyConnections,
  getConnectionSuggestions,
  getReceivedConnectionRequests,
  getSentConnectionRequests,
  patchConnectionStatus,
  postConnectionRequest,
  postConnectionRequestToUser,
  rejectConnection,
  searchConnectionCandidates,
} from "../controllers/connectionController.js";
import { protectMessaging } from "../middleware/messagingAuthMiddleware.js";
import { connectionRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { permissions, requirePermission } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protectMessaging);
router.use(requirePermission(permissions.NETWORK_USE));

router
  .route("/")
  .get(getMyConnections)
  .post(connectionRateLimiter, postConnectionRequest);

router.get("/search", searchConnectionCandidates);
router.get("/accepted", getAcceptedConnections);
router.get("/requests", getReceivedConnectionRequests);
router.get("/sent", getSentConnectionRequests);
router.get("/suggestions", getConnectionSuggestions);
router.get("/status/:userId", getConnectionStatus);
router.post("/request", connectionRateLimiter, postConnectionRequest);
router.post("/request/:userId", connectionRateLimiter, postConnectionRequestToUser);
router.delete("/user/:userId", deleteConnectionWithUser);
router.post("/:userId/block", connectionRateLimiter, blockConnectionUser);
router.patch("/:connectionId/accept", acceptConnection);
router.patch("/:connectionId/reject", rejectConnection);

router
  .route("/:connectionId")
  .patch(patchConnectionStatus)
  .delete(deleteConnection);

export default router;
