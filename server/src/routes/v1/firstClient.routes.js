import { Router } from "express";
import {
  getFirstClientStatus,
  getMyBadges,
  getStarterChallenges,
  refreshFirstClientStatus,
} from "../../controllers/firstClient.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateQuery } from "../../middleware/validate.middleware.js";
import { starterChallengeQuerySchema } from "../../validators/firstClient.validator.js";

const router = Router();

router.get("/status", authenticate, getFirstClientStatus);
router.post("/refresh", authenticate, refreshFirstClientStatus);
router.get(
  "/starter-challenges",
  authenticate,
  validateQuery(starterChallengeQuerySchema),
  getStarterChallenges,
);
router.get("/badges", authenticate, getMyBadges);

export default router;
