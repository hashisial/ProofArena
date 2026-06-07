import { Router } from "express";
import {
  getProviderComparison,
  getProviderFilterOptions,
  getProviders,
  getProviderByUsername,
  postProviderConnection,
  postProviderVerificationRequest,
} from "../controllers/providerSearchController.js";
import { optionalUser, protectUser } from "../middleware/authMiddleware.js";
import { uploadRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { uploadVerificationDocuments } from "../middleware/uploadMiddleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../middleware/roleMiddleware.js";
import { validateQuery } from "../middleware/validate.middleware.js";
import {
  providerCompareQuerySchema,
  providerSearchQuerySchema,
} from "../validators/provider.validator.js";

const router = Router();

router.get("/", optionalUser, validateQuery(providerSearchQuerySchema), getProviders);
router.get("/filters", getProviderFilterOptions);
router.get("/compare", optionalUser, validateQuery(providerCompareQuerySchema), getProviderComparison);
router.post(
  "/verification",
  protectUser,
  requireRole(roles.provider),
  requirePermission(permissions.MEDIA_UPLOAD),
  uploadRateLimiter,
  uploadVerificationDocuments,
  postProviderVerificationRequest,
);
router.get("/:username", optionalUser, getProviderByUsername);
router.post("/:username/connect", protectUser, postProviderConnection);

export default router;
