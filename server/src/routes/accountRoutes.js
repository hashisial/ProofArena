import { Router } from "express";
import {
  createMyCampaign,
  createMyLead,
  createMyEmailTemplate,
  createMyProject,
  createMyService,
  deleteMyLead,
  deleteMyService,
  deleteMyEmailTemplate,
  createMyReview,
  getMyCampaigns,
  getMyActivityFeed,
  getMyDashboard,
  getMyEmailTemplates,
  getMyLeadActivities,
  getMyLeadScrapeJob,
  getMyLeadScrapeJobs,
  getMyLeads,
  getMyOutreachEmails,
  getMyOutreachJobs,
  getMyPortfolioItems,
  getMyProfile,
  getMyProjects,
  getMyReviews,
  getMyServices,
  importMyLeads,
  sendMyOutreachEmail,
  startMyCampaign,
  startMyLeadScrape,
  startMyOutreachAutomation,
  updateMyCampaign,
  updateMyEmailTemplate,
  updateMyLead,
  updateMyProject,
  updateMyProfile,
  updateMyService,
  uploadMyServiceImages,
  uploadMyProfileMedia,
} from "../controllers/accountController.js";
import { enforceUserApiUsage } from "../middleware/apiUsageMiddleware.js";
import { protectUser } from "../middleware/authMiddleware.js";
import { uploadRateLimiter } from "../middleware/rateLimitMiddleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../middleware/roleMiddleware.js";
import { uploadProfileImage, uploadServiceImages } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(protectUser);
router.use(requireRole(roles.client, roles.provider));
router.use(enforceUserApiUsage);

router.get("/activity-feed", requirePermission(permissions.DASHBOARD_READ), getMyActivityFeed);
router.get("/dashboard", requirePermission(permissions.DASHBOARD_READ), getMyDashboard);
router
  .route("/profile")
  .get(requirePermission(permissions.PROFILE_READ), getMyProfile)
  .patch(requirePermission(permissions.PROFILE_UPDATE), updateMyProfile);
router.post(
  "/profile/media",
  requirePermission(permissions.MEDIA_UPLOAD),
  uploadRateLimiter,
  uploadProfileImage,
  uploadMyProfileMedia,
);
router
  .route("/leads")
  .get(requirePermission(permissions.LEADS_MANAGE), getMyLeads)
  .post(requirePermission(permissions.LEADS_MANAGE), createMyLead);
router.get("/lead-activities", requirePermission(permissions.LEADS_MANAGE), getMyLeadActivities);
router.post("/leads/import", requirePermission(permissions.LEADS_MANAGE), importMyLeads);
router
  .route("/leads/:id")
  .patch(requirePermission(permissions.LEADS_MANAGE), updateMyLead)
  .delete(requirePermission(permissions.LEADS_MANAGE), deleteMyLead);
router
  .route("/lead-scrapes")
  .get(requirePermission(permissions.SCRAPER_USE), getMyLeadScrapeJobs)
  .post(requirePermission(permissions.SCRAPER_USE), startMyLeadScrape);
router.get("/lead-scrapes/:id", requirePermission(permissions.SCRAPER_USE), getMyLeadScrapeJob);
router
  .route("/campaigns")
  .get(requirePermission(permissions.CAMPAIGNS_MANAGE), getMyCampaigns)
  .post(requirePermission(permissions.CAMPAIGNS_MANAGE), createMyCampaign);
router.route("/campaigns/:id").patch(requirePermission(permissions.CAMPAIGNS_MANAGE), updateMyCampaign);
router.post("/campaigns/:id/start", requirePermission(permissions.CAMPAIGNS_MANAGE), startMyCampaign);
router
  .route("/email-templates")
  .get(requirePermission(permissions.OUTREACH_MANAGE), getMyEmailTemplates)
  .post(requirePermission(permissions.OUTREACH_MANAGE), createMyEmailTemplate);
router
  .route("/email-templates/:id")
  .patch(requirePermission(permissions.OUTREACH_MANAGE), updateMyEmailTemplate)
  .delete(requirePermission(permissions.OUTREACH_MANAGE), deleteMyEmailTemplate);
router
  .route("/outreach-emails")
  .get(requirePermission(permissions.OUTREACH_MANAGE), getMyOutreachEmails)
  .post(requirePermission(permissions.OUTREACH_MANAGE), sendMyOutreachEmail);
router
  .route("/outreach-jobs")
  .get(requirePermission(permissions.OUTREACH_MANAGE), getMyOutreachJobs)
  .post(requirePermission(permissions.OUTREACH_MANAGE), startMyOutreachAutomation);
router.get("/portfolio", requirePermission(permissions.PORTFOLIO_READ_OWN), getMyPortfolioItems);
router
  .route("/services")
  .get(requirePermission(permissions.SERVICES_READ_OWN), getMyServices)
  .post(requirePermission(permissions.SERVICES_CREATE), createMyService);
router.post(
  "/services/images",
  requirePermission(permissions.SERVICES_CREATE),
  uploadRateLimiter,
  uploadServiceImages,
  uploadMyServiceImages,
);
router
  .route("/services/:id")
  .put(requirePermission(permissions.SERVICES_CREATE), updateMyService)
  .delete(requirePermission(permissions.SERVICES_CREATE), deleteMyService);
router
  .route("/projects")
  .get(requirePermission(permissions.PROJECTS_MANAGE), getMyProjects)
  .post(requirePermission(permissions.PROJECTS_MANAGE), createMyProject);
router.route("/projects/:id").patch(requirePermission(permissions.PROJECTS_MANAGE), updateMyProject);
router
  .route("/reviews")
  .get(requirePermission(permissions.REVIEWS_CREATE), getMyReviews)
  .post(requirePermission(permissions.REVIEWS_CREATE), createMyReview);

export default router;
