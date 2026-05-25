import { Router } from "express";
import {
  deleteAdminMarketplaceCategory,
  approveAdminMarketplaceService,
  deleteAdminBlog,
  deleteAdminMarketplaceService,
  deleteAdminReview,
  deleteAdminUserMedia,
  deleteAdminUser,
  getAdminSupportConversations,
  getAdminSupportMessages,
  getAdminBlogs,
  getAdminConnectionsOverview,
  getAdminConversationMetadata,
  getAdminPlans,
  getAdminMarketplaceCategories,
  getAdminMarketplaceProviders,
  getAdminMarketplaceServices,
  getAdminMarketplaceTransactions,
  getAdminReviews,
  getAdminReportedMessages,
  getAdminUsers,
  getSaasOverview,
  patchAdminPlan,
  patchAdminBlog,
  patchAdminMarketplaceCategory,
  patchAdminMarketplaceProvider,
  patchAdminMarketplaceService,
  patchAdminReview,
  patchAdminSupportConversation,
  patchAdminUser,
  patchAdminUserProfile,
  patchAdminUserSettings,
  patchOwnAdminPassword,
  postAdminBlog,
  postAdminMarketplaceCategory,
  postAdminMarketplaceRelease,
  postAdminReview,
  postAdminSupportMessage,
  postAdminUser,
  rejectAdminMarketplaceService,
  resetAdminUserPassword,
} from "../controllers/adminController.js";
import { protectAdmin, requireAdminPermission } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(protectAdmin);
router.get("/conversations", requireAdminPermission("support"), getAdminConversationMetadata);
router.get("/reported-messages", requireAdminPermission("support"), getAdminReportedMessages);
router.get("/connections/overview", requireAdminPermission("users"), getAdminConnectionsOverview);
router.get("/saas", requireAdminPermission("billing"), getSaasOverview);
router.get("/plans", requireAdminPermission("billing"), getAdminPlans);
router.patch("/plans/:planKey", requireAdminPermission("billing"), patchAdminPlan);
router.get(
  "/marketplace/transactions",
  requireAdminPermission("billing"),
  getAdminMarketplaceTransactions,
);
router
  .route("/marketplace/categories")
  .get(requireAdminPermission("content"), getAdminMarketplaceCategories)
  .post(requireAdminPermission("content"), postAdminMarketplaceCategory);
router
  .route("/marketplace/categories/:categoryId")
  .patch(requireAdminPermission("content"), patchAdminMarketplaceCategory)
  .delete(requireAdminPermission("content"), deleteAdminMarketplaceCategory);
router.get(
  "/marketplace/services",
  requireAdminPermission("content"),
  getAdminMarketplaceServices,
);
router.patch(
  "/marketplace/services/:serviceId",
  requireAdminPermission("content"),
  patchAdminMarketplaceService,
);
router.patch(
  "/marketplace/services/:serviceId/approve",
  requireAdminPermission("content"),
  approveAdminMarketplaceService,
);
router.patch(
  "/marketplace/services/:serviceId/reject",
  requireAdminPermission("content"),
  rejectAdminMarketplaceService,
);
router.delete(
  "/marketplace/services/:serviceId",
  requireAdminPermission("content"),
  deleteAdminMarketplaceService,
);
router.get(
  "/marketplace/providers",
  requireAdminPermission("users"),
  getAdminMarketplaceProviders,
);
router.patch(
  "/marketplace/providers/:userId",
  requireAdminPermission("users"),
  patchAdminMarketplaceProvider,
);
router.post(
  "/marketplace/transactions/:transactionId/release",
  requireAdminPermission("billing"),
  postAdminMarketplaceRelease,
);
router
  .route("/users")
  .get(requireAdminPermission("users"), getAdminUsers)
  .post(requireAdminPermission("settings"), postAdminUser);
router
  .route("/users/:id")
  .patch(requireAdminPermission("users"), patchAdminUser)
  .delete(requireAdminPermission("users"), deleteAdminUser);
router.patch("/users/:id/password", requireAdminPermission("users"), resetAdminUserPassword);
router.patch("/users/:id/profile", requireAdminPermission("users"), patchAdminUserProfile);
router.patch("/users/:id/settings", requireAdminPermission("users"), patchAdminUserSettings);
router.delete("/users/:id/media/:type", requireAdminPermission("users"), deleteAdminUserMedia);
router.patch("/me/password", requireAdminPermission("settings"), patchOwnAdminPassword);
router.get("/support/conversations", requireAdminPermission("support"), getAdminSupportConversations);
router.patch(
  "/support/conversations/:conversationId",
  requireAdminPermission("support"),
  patchAdminSupportConversation,
);
router.get(
  "/support/conversations/:conversationId/messages",
  requireAdminPermission("support"),
  getAdminSupportMessages,
);
router.post(
  "/support/conversations/:conversationId/messages",
  requireAdminPermission("support"),
  postAdminSupportMessage,
);
router
  .route("/blogs")
  .get(requireAdminPermission("articles"), getAdminBlogs)
  .post(requireAdminPermission("articles"), postAdminBlog);
router
  .route("/blogs/:id")
  .patch(requireAdminPermission("articles"), patchAdminBlog)
  .delete(requireAdminPermission("articles"), deleteAdminBlog);
router
  .route("/reviews")
  .get(requireAdminPermission("reviews"), getAdminReviews)
  .post(requireAdminPermission("reviews"), postAdminReview);
router
  .route("/reviews/:id")
  .patch(requireAdminPermission("reviews"), patchAdminReview)
  .delete(requireAdminPermission("reviews"), deleteAdminReview);

export default router;
