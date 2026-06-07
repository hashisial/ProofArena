import { Router } from "express";
import {
  addOpportunityNote,
  archiveOpportunity,
  completeNextAction,
  createOpportunity,
  getMyOpportunities,
  getOpportunityById,
  getOpportunityStats,
  updateNextAction,
  updateOpportunity,
  updateOpportunityStage,
} from "../../controllers/opportunityPipeline.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.middleware.js";
import {
  addOpportunityNoteSchema,
  completeNextActionSchema,
  createOpportunitySchema,
  opportunityIdParamSchema,
  opportunityQuerySchema,
  updateNextActionSchema,
  updateOpportunitySchema,
  updateOpportunityStageSchema,
} from "../../validators/opportunityPipeline.validator.js";

const router = Router();

router.post("/", authenticate, validateBody(createOpportunitySchema), createOpportunity);
router.get("/", authenticate, validateQuery(opportunityQuerySchema), getMyOpportunities);
router.get("/stats", authenticate, getOpportunityStats);
router.get("/:opportunityId", authenticate, validateParams(opportunityIdParamSchema), getOpportunityById);
router.patch(
  "/:opportunityId",
  authenticate,
  validateParams(opportunityIdParamSchema),
  validateBody(updateOpportunitySchema),
  updateOpportunity,
);
router.patch(
  "/:opportunityId/stage",
  authenticate,
  validateParams(opportunityIdParamSchema),
  validateBody(updateOpportunityStageSchema),
  updateOpportunityStage,
);
router.post(
  "/:opportunityId/notes",
  authenticate,
  validateParams(opportunityIdParamSchema),
  validateBody(addOpportunityNoteSchema),
  addOpportunityNote,
);
router.patch(
  "/:opportunityId/next-action",
  authenticate,
  validateParams(opportunityIdParamSchema),
  validateBody(updateNextActionSchema),
  updateNextAction,
);
router.post(
  "/:opportunityId/next-action/complete",
  authenticate,
  validateParams(opportunityIdParamSchema),
  validateBody(completeNextActionSchema),
  completeNextAction,
);
router.post(
  "/:opportunityId/archive",
  authenticate,
  validateParams(opportunityIdParamSchema),
  archiveOpportunity,
);

export default router;
