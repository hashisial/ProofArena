import { Router } from "express";
import {
  getMySubscription,
  getPlans,
  openCustomerPortal,
  selectFreePlan,
  startCheckout,
} from "../controllers/billingController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/plans", getPlans);
router.use(protectUser);
router.use(requireRole(roles.client, roles.provider));
router.get("/subscription", requirePermission(permissions.BILLING_MANAGE), getMySubscription);
router.post("/checkout-session", requirePermission(permissions.BILLING_MANAGE), startCheckout);
router.post("/portal-session", requirePermission(permissions.BILLING_MANAGE), openCustomerPortal);
router.post("/select-free", requirePermission(permissions.BILLING_MANAGE), selectFreePlan);

export default router;
