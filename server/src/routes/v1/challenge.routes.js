import { Router } from "express";
import {
  archiveChallenge,
  closeChallenge,
  createChallenge,
  deleteChallenge,
  getChallengeById,
  getMyChallenges,
  getPublicChallengeBySlug,
  getPublicChallenges,
  pauseChallenge,
  publishChallenge,
  updateChallenge,
} from "../../controllers/challenge.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole, roles } from "../../middleware/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate.middleware.js";
import {
  challengeIdParamSchema,
  challengeSlugParamSchema,
  createChallengeSchema,
  publicChallengeSearchQuerySchema,
  updateChallengeSchema,
} from "../../validators/challenge.validator.js";

const router = Router();
const clientOnly = [authenticate, requireRole(roles.client)];

router
  .route("/")
  .get(validateQuery(publicChallengeSearchQuerySchema), getPublicChallenges)
  .post(...clientOnly, validateBody(createChallengeSchema), createChallenge);

router.get("/me", ...clientOnly, getMyChallenges);

router.get(
  "/id/:challengeId",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  getChallengeById,
);

router.patch(
  "/:challengeId",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  validateBody(updateChallengeSchema),
  updateChallenge,
);

router.post(
  "/:challengeId/publish",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  publishChallenge,
);

router.post(
  "/:challengeId/pause",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  pauseChallenge,
);

router.post(
  "/:challengeId/close",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  closeChallenge,
);

router.post(
  "/:challengeId/archive",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  archiveChallenge,
);

router.delete(
  "/:challengeId",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  deleteChallenge,
);

router.get(
  "/:username/:slug",
  validateParams(challengeSlugParamSchema),
  getPublicChallengeBySlug,
);

export default router;
