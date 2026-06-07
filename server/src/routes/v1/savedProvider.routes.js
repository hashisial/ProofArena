import { Router } from "express";
import {
  getMySavedProviders,
  getSavedProviderStatus,
  saveProvider,
  unsaveProvider,
  updateSavedProvider,
} from "../../controllers/savedProvider.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate.middleware.js";
import {
  providerIdParamSchema,
  savedProviderIdParamSchema,
  savedProviderQuerySchema,
  saveProviderSchema,
  updateSavedProviderSchema,
} from "../../validators/savedProvider.validator.js";

const router = Router();

router.post("/", authenticate, validateBody(saveProviderSchema), saveProvider);
router.get("/", authenticate, validateQuery(savedProviderQuerySchema), getMySavedProviders);
router.get(
  "/provider/:providerId/status",
  authenticate,
  validateParams(providerIdParamSchema),
  getSavedProviderStatus,
);
router.patch(
  "/:savedProviderId",
  authenticate,
  validateParams(savedProviderIdParamSchema),
  validateBody(updateSavedProviderSchema),
  updateSavedProvider,
);
router.delete(
  "/provider/:providerId",
  authenticate,
  validateParams(providerIdParamSchema),
  unsaveProvider,
);

export default router;
