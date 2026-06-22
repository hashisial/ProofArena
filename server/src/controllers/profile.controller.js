import {
  addEducation as addProfileEducation,
  addExperience as addProfileExperience,
  addService as addProfileService,
  deleteEducation as deleteProfileEducation,
  deleteExperience as deleteProfileExperience,
  deleteService as deleteProfileService,
  getOwnerProfile,
  getOwnerAnalytics,
  getPrivacySettings,
  getPublicProfilePreview,
  getPublicActivityByUsername,
  getPublishedPublicProfile,
  getPublicProfile,
  getVerificationStatus,
  requestVerification as requestProfileVerification,
  updateOnboardingProgress as updateProfileOnboardingProgress,
  updatePrivacySettings as updateProfilePrivacySettings,
  updateProfilePublishState as updateOwnerProfilePublishState,
  updateProfileSection as updateOwnerProfileSection,
  updateEducation as updateProfileEducation,
  updateExperience as updateProfileExperience,
  updateOpenTo as updateProfileOpenTo,
  updateService as updateProfileService,
  updateBasicProfile,
  updateAboutSection,
  updateAvatar as updateAvatarMedia,
  updateCoverImage as updateCoverImageMedia,
  updateProfileIntro,
  updateSkillsSection,
} from "../services/profile.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyProfile = asyncHandler(async (request, response) => {
  const profile = await getOwnerProfile(request.user.id);
  return successResponse(response, 200, "Owner profile fetched successfully", profile);
});

export const updateMyProfileSection = asyncHandler(async (request, response) => {
  const profile = await updateOwnerProfileSection(
    request.user.id,
    request.params.sectionKey,
    request.body ?? {},
  );
  return successResponse(response, 200, "Profile section saved successfully", profile);
});

export const updateMyOnboardingProgress = asyncHandler(async (request, response) => {
  const profile = await updateProfileOnboardingProgress(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Profile onboarding progress saved successfully", profile);
});

export const getMyPublicProfilePreview = asyncHandler(async (request, response) => {
  const profile = await getPublicProfilePreview(request.user.id);
  return successResponse(response, 200, "Public profile preview fetched successfully", profile);
});

export const updateMyProfilePublishState = asyncHandler(async (request, response) => {
  const profile = await updateOwnerProfilePublishState(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Profile publish state saved successfully", profile);
});

export const getPublishedPublicProfileController = asyncHandler(async (request, response) => {
  const profile = await getPublishedPublicProfile(request.params.identifier);
  return successResponse(response, 200, "Public profile fetched successfully", profile);
});

export const getMyProfileAnalytics = asyncHandler(async (request, response) => {
  const analytics = await getOwnerAnalytics(request.user.id);
  return successResponse(response, 200, "Profile analytics fetched successfully", analytics);
});

export const updateMyProfile = asyncHandler(async (request, response) => {
  const profile = await updateBasicProfile(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Profile updated successfully", profile);
});

export const updateIntro = asyncHandler(async (request, response) => {
  const profile = await updateProfileIntro(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Profile intro updated successfully", profile);
});

export const updateAbout = asyncHandler(async (request, response) => {
  const profile = await updateAboutSection(request.user.id, request.body?.bio ?? "");
  return successResponse(response, 200, "About section updated successfully", profile);
});

export const updateSkills = asyncHandler(async (request, response) => {
  const profile = await updateSkillsSection(request.user.id, request.body?.skills ?? []);
  return successResponse(response, 200, "Skills updated successfully", profile);
});

export const addExperience = asyncHandler(async (request, response) => {
  const profile = await addProfileExperience(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Experience added successfully", profile);
});

export const updateExperience = asyncHandler(async (request, response) => {
  const profile = await updateProfileExperience(
    request.user.id,
    request.params.experienceId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Experience updated successfully", profile);
});

export const deleteExperience = asyncHandler(async (request, response) => {
  const profile = await deleteProfileExperience(request.user.id, request.params.experienceId);
  return successResponse(response, 200, "Experience deleted successfully", profile);
});

export const addEducation = asyncHandler(async (request, response) => {
  const profile = await addProfileEducation(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Education added successfully", profile);
});

export const updateEducation = asyncHandler(async (request, response) => {
  const profile = await updateProfileEducation(
    request.user.id,
    request.params.educationId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Education updated successfully", profile);
});

export const deleteEducation = asyncHandler(async (request, response) => {
  const profile = await deleteProfileEducation(request.user.id, request.params.educationId);
  return successResponse(response, 200, "Education deleted successfully", profile);
});

export const addService = asyncHandler(async (request, response) => {
  const profile = await addProfileService(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Service added successfully", profile);
});

export const updateService = asyncHandler(async (request, response) => {
  const profile = await updateProfileService(
    request.user.id,
    request.params.serviceId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Service updated successfully", profile);
});

export const deleteService = asyncHandler(async (request, response) => {
  const profile = await deleteProfileService(request.user.id, request.params.serviceId);
  return successResponse(response, 200, "Service deleted successfully", profile);
});

export const updateOpenTo = asyncHandler(async (request, response) => {
  const profile = await updateProfileOpenTo(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Open to preferences updated successfully", profile);
});

export const getMyPrivacySettings = asyncHandler(async (request, response) => {
  const privacy = await getPrivacySettings(request.user.id);
  return successResponse(response, 200, "Privacy settings fetched successfully", privacy);
});

export const updatePrivacySettings = asyncHandler(async (request, response) => {
  const privacy = await updateProfilePrivacySettings(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Privacy settings updated successfully", privacy);
});

export const getPublicProfileActivity = asyncHandler(async (request, response) => {
  const activity = await getPublicActivityByUsername(request.params.username);
  return successResponse(response, 200, "Profile activity fetched successfully", activity);
});

export const getMyVerificationStatus = asyncHandler(async (request, response) => {
  const verification = await getVerificationStatus(request.user.id);
  return successResponse(response, 200, "Verification status fetched successfully", verification);
});

export const requestVerification = asyncHandler(async (request, response) => {
  const verification = await requestProfileVerification(request.user.id, request.body ?? {});
  return successResponse(response, 200, "Verification request submitted successfully", verification);
});

export const getProfileByUsername = asyncHandler(async (request, response) => {
  const profile = await getPublicProfile(request.params.username, request.user?.id ?? null);
  return successResponse(response, 200, "Public profile fetched successfully", profile);
});

export const getPublicProfileController = getProfileByUsername;

export const updateAvatar = asyncHandler(async (request, response) => {
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  const profile = await updateAvatarMedia(request.user.id, request.file, {
    baseUrl,
  });

  return successResponse(response, 200, "Profile photo updated successfully", profile);
});

export const updateCoverImage = asyncHandler(async (request, response) => {
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  const profile = await updateCoverImageMedia(request.user.id, request.file, {
    baseUrl,
  });

  return successResponse(response, 200, "Cover photo updated successfully", profile);
});

export const uploadAvatar = updateAvatar;
export const uploadCover = updateCoverImage;
