import { Router } from "express";
import {
  addEducation,
  addExperience,
  addService,
  deleteEducation,
  deleteExperience,
  deleteService,
  getMyProfile,
  getMyProfileAnalytics,
  getMyPrivacySettings,
  getMyVerificationStatus,
  getProfileByUsername,
  getPublicProfileActivity,
  requestVerification,
  updateAvatar,
  updateCoverImage,
  updateAbout,
  updateEducation,
  updateExperience,
  updateIntro,
  updateMyProfile,
  updateOpenTo,
  updatePrivacySettings,
  updateService,
  updateSkills,
  uploadAvatar,
  uploadCover,
} from "../../controllers/profile.controller.js";
import { optionalAuthenticate, protectUser } from "../../middleware/auth.middleware.js";
import { uploadRateLimiter } from "../../middleware/rateLimitMiddleware.js";
import { validateBody, validateParams } from "../../middleware/validate.middleware.js";
import {
  permissions,
  requirePermission,
  requireRole,
  roles,
} from "../../middleware/role.middleware.js";
import {
  uploadAvatar as uploadAvatarImage,
  uploadCover as uploadCoverImage,
} from "../../middleware/uploadMiddleware.js";
import {
  educationSchema,
  experienceSchema,
  openToSchema,
  profileItemIdSchema,
  profileUsernameParamSchema,
  requestVerificationSchema,
  serviceSchema,
  updateAboutSchema,
  updateIntroSchema,
  updatePrivacySettingsSchema,
  updateProfileSchema,
  updateSkillsSchema,
} from "../../validators/profile.validator.js";

const router = Router();
const ownerAccess = [
  protectUser,
  requireRole(roles.client, roles.provider),
];

router
  .route("/me")
  .get(...ownerAccess, requirePermission(permissions.PROFILE_READ), getMyProfile)
  .patch(
    ...ownerAccess,
    requirePermission(permissions.PROFILE_UPDATE),
    validateBody(updateProfileSchema),
    updateMyProfile,
  );

router.get(
  "/me/analytics",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_READ),
  getMyProfileAnalytics,
);

router
  .route("/privacy")
  .get(
    ...ownerAccess,
    requirePermission(permissions.PROFILE_READ),
    getMyPrivacySettings,
  )
  .patch(
    ...ownerAccess,
    requirePermission(permissions.PROFILE_UPDATE),
    validateBody(updatePrivacySettingsSchema),
    updatePrivacySettings,
  );

router.get(
  "/verification",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_READ),
  getMyVerificationStatus,
);

router.post(
  "/verification/request",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(requestVerificationSchema),
  requestVerification,
);

router.patch(
  "/intro",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(updateIntroSchema),
  updateIntro,
);

router.patch(
  "/about",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(updateAboutSchema),
  updateAbout,
);

router.patch(
  "/skills",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(updateSkillsSchema),
  updateSkills,
);

router.post(
  "/experience",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(experienceSchema),
  addExperience,
);

router.patch(
  "/experience/:experienceId",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateParams(profileItemIdSchema),
  validateBody(experienceSchema),
  updateExperience,
);

router.delete(
  "/experience/:experienceId",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateParams(profileItemIdSchema),
  deleteExperience,
);

router.post(
  "/education",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(educationSchema),
  addEducation,
);

router.patch(
  "/education/:educationId",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateParams(profileItemIdSchema),
  validateBody(educationSchema),
  updateEducation,
);

router.delete(
  "/education/:educationId",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateParams(profileItemIdSchema),
  deleteEducation,
);

router.post(
  "/services",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(serviceSchema),
  addService,
);

router.patch(
  "/services/:serviceId",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateParams(profileItemIdSchema),
  validateBody(serviceSchema),
  updateService,
);

router.delete(
  "/services/:serviceId",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateParams(profileItemIdSchema),
  deleteService,
);

router.patch(
  "/open-to",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(openToSchema),
  updateOpenTo,
);

router.put(
  "/update",
  ...ownerAccess,
  requirePermission(permissions.PROFILE_UPDATE),
  validateBody(updateProfileSchema),
  updateMyProfile,
);

router.patch(
  "/avatar",
  ...ownerAccess,
  requirePermission(permissions.MEDIA_UPLOAD),
  uploadRateLimiter,
  uploadAvatarImage,
  updateAvatar,
);

router.patch(
  "/cover",
  ...ownerAccess,
  requirePermission(permissions.MEDIA_UPLOAD),
  uploadRateLimiter,
  uploadCoverImage,
  updateCoverImage,
);

router.post(
  "/upload-avatar",
  ...ownerAccess,
  requirePermission(permissions.MEDIA_UPLOAD),
  uploadRateLimiter,
  uploadAvatarImage,
  uploadAvatar,
);

router.post(
  "/upload-cover",
  ...ownerAccess,
  requirePermission(permissions.MEDIA_UPLOAD),
  uploadRateLimiter,
  uploadCoverImage,
  uploadCover,
);

router.get(
  "/:username/activity",
  optionalAuthenticate,
  validateParams(profileUsernameParamSchema),
  getPublicProfileActivity,
);

router.get(
  "/:username/public",
  optionalAuthenticate,
  validateParams(profileUsernameParamSchema),
  getProfileByUsername,
);

router.get(
  "/:username",
  optionalAuthenticate,
  validateParams(profileUsernameParamSchema),
  getProfileByUsername,
);

export default router;
