import { Router } from "express";
import {
  createService,
  deleteService,
  getProviderServices,
  getServiceBySlug,
  getServices,
  updateService,
} from "../controllers/serviceController.js";
import { optionalUser, protectUser } from "../middleware/authMiddleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../middleware/roleMiddleware.js";

const router = Router();

router
  .route("/")
  .get(optionalUser, getServices)
  .post(
    protectUser,
    requireRole(roles.provider),
    requirePermission(permissions.SERVICES_CREATE),
    createService,
  );

router.get("/provider/:providerId", getProviderServices);
router.get("/slug/:slug", optionalUser, getServiceBySlug);
router.get("/:slug", optionalUser, getServiceBySlug);
router
  .route("/:id")
  .put(
    protectUser,
    requireRole(roles.provider),
    requirePermission(permissions.SERVICES_CREATE),
    updateService,
  )
  .delete(
    protectUser,
    requireRole(roles.provider),
    requirePermission(permissions.SERVICES_CREATE),
    deleteService,
  );

export default router;
