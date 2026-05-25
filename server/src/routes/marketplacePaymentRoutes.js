import { Router } from "express";
import {
  completeMarketplaceWork,
  getMyConnectedAccount,
  getMyMarketplaceTransactions,
  postMarketplaceCheckoutSession,
  postMyConnectedAccount,
  postMyConnectedAccountOnboardingLink,
} from "../controllers/marketplacePaymentController.js";
import {
  deleteMyMarketplaceFavorite,
  getMarketplaceService,
  getMarketplaceServices,
  getMyMarketplaceFavorites,
  postMyMarketplaceFavorite,
} from "../controllers/marketplaceController.js";
import {
  getMarketplaceCategories,
  getMarketplaceCategoryBySlug,
} from "../controllers/categoryController.js";
import { getProviders } from "../controllers/providerSearchController.js";
import { optionalUser, protectUser } from "../middleware/authMiddleware.js";
import { validateQuery } from "../middleware/validate.middleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../middleware/roleMiddleware.js";
import { providerSearchQuerySchema } from "../validators/search.validator.js";

const router = Router();

router.get("/categories", getMarketplaceCategories);
router.get("/categories/:slug", getMarketplaceCategoryBySlug);
router.get("/providers", optionalUser, validateQuery(providerSearchQuerySchema), getProviders);
router.get("/services", optionalUser, getMarketplaceServices);
router.get("/service/:slug", optionalUser, getMarketplaceService);
router.get("/services/:serviceId", optionalUser, getMarketplaceService);

router.use(protectUser);
router.use(requireRole(roles.client, roles.provider));

router
  .route("/favorites")
  .get(requirePermission(permissions.MARKETPLACE_READ), getMyMarketplaceFavorites)
  .post(requirePermission(permissions.MARKETPLACE_READ), postMyMarketplaceFavorite);
router.delete(
  "/favorites/:targetType/:targetId",
  requirePermission(permissions.MARKETPLACE_READ),
  deleteMyMarketplaceFavorite,
);

router.get(
  "/connect/account",
  requirePermission(permissions.MARKETPLACE_PAYOUTS),
  getMyConnectedAccount,
);
router.post(
  "/connect/account",
  requirePermission(permissions.MARKETPLACE_PAYOUTS),
  postMyConnectedAccount,
);
router.post(
  "/connect/onboarding-link",
  requirePermission(permissions.MARKETPLACE_PAYOUTS),
  postMyConnectedAccountOnboardingLink,
);
router.get(
  "/transactions",
  requirePermission(permissions.MARKETPLACE_READ),
  getMyMarketplaceTransactions,
);
router.post(
  "/checkout-session",
  requirePermission(permissions.MARKETPLACE_HIRE),
  postMarketplaceCheckoutSession,
);
router.post(
  "/transactions/:transactionId/complete-work",
  requirePermission(permissions.MARKETPLACE_COMPLETE_WORK),
  completeMarketplaceWork,
);

export default router;
