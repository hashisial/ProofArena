import { Router } from "express";
import {
  getAdminAnalyticsSummary,
  trackMarketplaceEvent,
  trackPageVisit,
} from "../controllers/analyticsController.js";
import { protectAdmin, requireAdminPermission } from "../middleware/adminMiddleware.js";
import { optionalUser } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/visits", optionalUser, trackPageVisit);
router.post("/events", optionalUser, trackMarketplaceEvent);
router.get(
  "/summary",
  protectAdmin,
  requireAdminPermission("overview"),
  getAdminAnalyticsSummary,
);

export default router;
