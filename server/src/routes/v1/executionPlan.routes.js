import { Router } from "express";
import {
  acceptExecutionPlan,
  getExecutionPlanByIdForClient,
  getExecutionPlanByIdForProvider,
  getMyExecutionPlans,
  getPlansForClientChallenge,
  rejectExecutionPlan,
  shortlistExecutionPlan,
  submitExecutionPlan,
  updateExecutionPlan,
  withdrawExecutionPlan,
} from "../../controllers/executionPlan.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole, roles } from "../../middleware/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate.middleware.js";
import {
  challengePlanQuerySchema,
  clientDecisionSchema,
  createExecutionPlanSchema,
  executionPlanChallengeIdParamSchema,
  executionPlanIdParamSchema,
  providerPlanQuerySchema,
  updateExecutionPlanSchema,
} from "../../validators/executionPlan.validator.js";

const router = Router();
const providerOnly = [authenticate, requireRole(roles.provider)];
const clientOnly = [authenticate, requireRole(roles.client)];

router.post(
  "/",
  ...providerOnly,
  validateBody(createExecutionPlanSchema),
  submitExecutionPlan,
);

router.get(
  "/me",
  ...providerOnly,
  validateQuery(providerPlanQuerySchema),
  getMyExecutionPlans,
);

router.get(
  "/id/:planId",
  ...providerOnly,
  validateParams(executionPlanIdParamSchema),
  getExecutionPlanByIdForProvider,
);

router.get(
  "/challenge/:challengeId",
  ...clientOnly,
  validateParams(executionPlanChallengeIdParamSchema),
  validateQuery(challengePlanQuerySchema),
  getPlansForClientChallenge,
);

router.get(
  "/client/:planId",
  ...clientOnly,
  validateParams(executionPlanIdParamSchema),
  getExecutionPlanByIdForClient,
);

router.patch(
  "/:planId",
  ...providerOnly,
  validateParams(executionPlanIdParamSchema),
  validateBody(updateExecutionPlanSchema),
  updateExecutionPlan,
);

router.post(
  "/:planId/withdraw",
  ...providerOnly,
  validateParams(executionPlanIdParamSchema),
  withdrawExecutionPlan,
);

router.post(
  "/:planId/shortlist",
  ...clientOnly,
  validateParams(executionPlanIdParamSchema),
  validateBody(clientDecisionSchema),
  shortlistExecutionPlan,
);

router.post(
  "/:planId/reject",
  ...clientOnly,
  validateParams(executionPlanIdParamSchema),
  validateBody(clientDecisionSchema),
  rejectExecutionPlan,
);

router.post(
  "/:planId/accept",
  ...clientOnly,
  validateParams(executionPlanIdParamSchema),
  validateBody(clientDecisionSchema),
  acceptExecutionPlan,
);

export default router;
