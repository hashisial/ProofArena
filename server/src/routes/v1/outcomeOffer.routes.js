import { Router } from "express";
import {
  archiveOutcomeOffer,
  createOutcomeOffer,
  deleteOutcomeOffer,
  getMyOutcomeOffers,
  getOutcomeOfferById,
  getPublicOutcomeOfferBySlug,
  getPublicOutcomeOffers,
  pauseOutcomeOffer,
  publishOutcomeOffer,
  updateOutcomeOffer,
} from "../../controllers/outcomeOffer.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole, roles } from "../../middleware/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate.middleware.js";
import {
  createOutcomeOfferSchema,
  offerIdParamSchema,
  offerSlugParamSchema,
  publicOfferSearchQuerySchema,
  updateOutcomeOfferSchema,
} from "../../validators/outcomeOffer.validator.js";

const router = Router();
const providerOnly = [authenticate, requireRole(roles.provider)];

router
  .route("/")
  .get(validateQuery(publicOfferSearchQuerySchema), getPublicOutcomeOffers)
  .post(...providerOnly, validateBody(createOutcomeOfferSchema), createOutcomeOffer);

router.get("/me", ...providerOnly, getMyOutcomeOffers);

router.get(
  "/id/:offerId",
  ...providerOnly,
  validateParams(offerIdParamSchema),
  getOutcomeOfferById,
);

router.patch(
  "/:offerId",
  ...providerOnly,
  validateParams(offerIdParamSchema),
  validateBody(updateOutcomeOfferSchema),
  updateOutcomeOffer,
);

router.post(
  "/:offerId/publish",
  ...providerOnly,
  validateParams(offerIdParamSchema),
  publishOutcomeOffer,
);

router.post(
  "/:offerId/pause",
  ...providerOnly,
  validateParams(offerIdParamSchema),
  pauseOutcomeOffer,
);

router.post(
  "/:offerId/archive",
  ...providerOnly,
  validateParams(offerIdParamSchema),
  archiveOutcomeOffer,
);

router.delete(
  "/:offerId",
  ...providerOnly,
  validateParams(offerIdParamSchema),
  deleteOutcomeOffer,
);

router.get(
  "/:username/:slug",
  validateParams(offerSlugParamSchema),
  getPublicOutcomeOfferBySlug,
);

export default router;
