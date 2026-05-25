import { Router } from "express";
import {
  getChallengeRecommendedProviders,
  getClientMatchById,
  getMyMatchedChallenges,
  getProviderMatchById,
  refreshChallengeMatches,
  refreshMyMatches,
  updateClientMatchStatus,
  updateProviderMatchStatus,
} from "../../controllers/match.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole, roles } from "../../middleware/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate.middleware.js";
import {
  challengeIdParamSchema,
  challengeRecommendedProvidersQuerySchema,
  matchIdParamSchema,
  matchQuerySchema,
  updateMatchStatusSchema,
} from "../../validators/match.validator.js";

const router = Router();
const providerOnly = [authenticate, requireRole(roles.provider)];
const clientOnly = [authenticate, requireRole(roles.client)];

router.post(
  "/provider/refresh",
  ...providerOnly,
  validateQuery(matchQuerySchema),
  refreshMyMatches,
);

router.get(
  "/provider",
  ...providerOnly,
  validateQuery(matchQuerySchema),
  getMyMatchedChallenges,
);

router.get(
  "/provider/:matchId",
  ...providerOnly,
  validateParams(matchIdParamSchema),
  getProviderMatchById,
);

router.patch(
  "/provider/:matchId/status",
  ...providerOnly,
  validateParams(matchIdParamSchema),
  validateBody(updateMatchStatusSchema),
  updateProviderMatchStatus,
);

router.post(
  "/challenge/:challengeId/refresh",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  validateQuery(challengeRecommendedProvidersQuerySchema),
  refreshChallengeMatches,
);

router.get(
  "/challenge/:challengeId/providers",
  ...clientOnly,
  validateParams(challengeIdParamSchema),
  validateQuery(challengeRecommendedProvidersQuerySchema),
  getChallengeRecommendedProviders,
);

router.get(
  "/client/:matchId",
  ...clientOnly,
  validateParams(matchIdParamSchema),
  getClientMatchById,
);

router.patch(
  "/client/:matchId/status",
  ...clientOnly,
  validateParams(matchIdParamSchema),
  validateBody(updateMatchStatusSchema),
  updateClientMatchStatus,
);

export default router;
