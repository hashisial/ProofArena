import { Router } from "express";
import {
  attachProofAssetToContext,
  createProofAsset,
  deleteProofAsset,
  detachProofAssetFromContext,
  getMyProofAssets,
  getProofAssetById,
  updateProofAsset,
} from "../../controllers/proofAsset.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.middleware.js";
import {
  createProofAssetSchema,
  proofAssetContextSchema,
  proofAssetIdParamSchema,
  proofAssetQuerySchema,
  updateProofAssetSchema,
} from "../../validators/proofAsset.validator.js";

const router = Router();

router.post("/", authenticate, validateBody(createProofAssetSchema), createProofAsset);
router.get("/me", authenticate, validateQuery(proofAssetQuerySchema), getMyProofAssets);
router.get("/id/:assetId", authenticate, validateParams(proofAssetIdParamSchema), getProofAssetById);
router.patch("/:assetId", authenticate, validateParams(proofAssetIdParamSchema), validateBody(updateProofAssetSchema), updateProofAsset);
router.delete("/:assetId", authenticate, validateParams(proofAssetIdParamSchema), deleteProofAsset);
router.post("/:assetId/attach", authenticate, validateParams(proofAssetIdParamSchema), validateBody(proofAssetContextSchema), attachProofAssetToContext);
router.post("/:assetId/detach", authenticate, validateParams(proofAssetIdParamSchema), validateBody(proofAssetContextSchema), detachProofAssetFromContext);

export default router;
