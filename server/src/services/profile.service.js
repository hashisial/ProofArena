import {
  calculateProfileCompletion,
  addEducationForUser,
  addExperienceForUser,
  addServiceForUser,
  deleteEducationForUser,
  deleteExperienceForUser,
  deleteServiceForUser,
  getOwnerAnalyticsForUser,
  getPrivacySettingsForUser,
  getPublicActivityForUsername,
  getPublicProfilePreviewForUser,
  getPublicProfileByUsername,
  getPublishedPublicProfileByIdentifier,
  getUserProfileForUser,
  getVerificationStatusForUser,
  requestVerificationForUser,
  updatePrivacySettingsForUser,
  updateEducationForUser,
  updateExperienceForUser,
  updateOpenToForUser,
  updateOnboardingProgressForUser,
  updateProfilePublishStateForUser,
  updateProfileSectionForUser,
  updateServiceForUser,
  updateUserProfileAboutForUser,
  updateUserProfileForUser,
  updateUserProfileMediaForUser,
  updateUserProfileSkillsForUser,
} from "./userProfileService.js";

export function getOwnerProfile(userId) {
  return getUserProfileForUser(userId);
}

export function updateProfileSection(userId, sectionKey, payload = {}) {
  return updateProfileSectionForUser(userId, sectionKey, payload);
}

export function updateOnboardingProgress(userId, payload = {}) {
  return updateOnboardingProgressForUser(userId, payload);
}

export function getPublicProfilePreview(userId) {
  return getPublicProfilePreviewForUser(userId);
}

export function updateProfilePublishState(userId, payload = {}) {
  return updateProfilePublishStateForUser(userId, payload);
}

export function getPublishedPublicProfile(identifier) {
  return getPublishedPublicProfileByIdentifier(identifier);
}

export function updateBasicProfile(userId, payload = {}) {
  return updateUserProfileForUser(userId, payload);
}

export const updateOwnerProfile = updateBasicProfile;

export function updateProfileIntro(userId, payload = {}) {
  const introPayload = {
    company: payload.company ?? payload.companyName,
    companyName: payload.companyName ?? payload.company,
    currentCompany: payload.currentCompany ?? payload.companyName ?? payload.company,
    currentPosition: payload.currentPosition,
    fullName: payload.fullName,
    headline: payload.headline,
    industry: payload.industry,
    location: payload.location,
    profileVisibility: payload.profileVisibility,
    username: payload.username,
    website: payload.website,
  };

  return updateUserProfileForUser(userId, introPayload);
}

export function updateProfileAbout(userId, payload = {}) {
  const bio = typeof payload === "string" ? payload : payload.bio ?? payload.about;

  return updateUserProfileAboutForUser(userId, bio);
}

export const updateAboutSection = updateProfileAbout;

export function updateProfileSkills(userId, payload = {}) {
  const skills = Array.isArray(payload) ? payload : payload.skills;

  return updateUserProfileSkillsForUser(userId, skills ?? []);
}

export const updateSkillsSection = updateProfileSkills;

export function addExperience(userId, payload = {}) {
  return addExperienceForUser(userId, payload);
}

export function updateExperience(userId, experienceId, payload = {}) {
  return updateExperienceForUser(userId, experienceId, payload);
}

export function deleteExperience(userId, experienceId) {
  return deleteExperienceForUser(userId, experienceId);
}

export function addEducation(userId, payload = {}) {
  return addEducationForUser(userId, payload);
}

export function updateEducation(userId, educationId, payload = {}) {
  return updateEducationForUser(userId, educationId, payload);
}

export function deleteEducation(userId, educationId) {
  return deleteEducationForUser(userId, educationId);
}

export function addService(userId, payload = {}) {
  return addServiceForUser(userId, payload);
}

export function updateService(userId, serviceId, payload = {}) {
  return updateServiceForUser(userId, serviceId, payload);
}

export function deleteService(userId, serviceId) {
  return deleteServiceForUser(userId, serviceId);
}

export function updateOpenTo(userId, payload = {}) {
  return updateOpenToForUser(userId, payload);
}

export function getOwnerAnalytics(userId) {
  return getOwnerAnalyticsForUser(userId);
}

export function getPublicActivityByUsername(username) {
  return getPublicActivityForUsername(username);
}

export function getVerificationStatus(userId) {
  return getVerificationStatusForUser(userId);
}

export function requestVerification(userId, payload = {}) {
  return requestVerificationForUser(userId, payload);
}

export function getPrivacySettings(userId) {
  return getPrivacySettingsForUser(userId);
}

export function updatePrivacySettings(userId, payload = {}) {
  return updatePrivacySettingsForUser(userId, payload);
}

export function getPublicProfile(username, viewerId = null) {
  return getPublicProfileByUsername(username, viewerId);
}

export function uploadProfileMedia(userId, options = {}) {
  return updateUserProfileMediaForUser(userId, options);
}

export function updateAvatar(userId, file, options = {}) {
  return updateUserProfileMediaForUser(userId, {
    ...options,
    file,
    type: "avatar",
  });
}

export function updateCoverImage(userId, file, options = {}) {
  return updateUserProfileMediaForUser(userId, {
    ...options,
    file,
    type: "cover",
  });
}

export function sanitizeOwnerProfileData(data) {
  return {
    ...(data ?? {}),
    isOwner: true,
  };
}

export function sanitizePublicProfileData(data) {
  const profile = { ...(data?.profile ?? {}) };
  delete profile.analytics;
  delete profile.phone;
  delete profile.postImpressions;
  delete profile.profileCompletion;
  delete profile.profileViews;
  delete profile.searchAppearances;
  if (profile.verificationBadge?.status !== "verified") {
    profile.verificationBadge = {
      label: "",
      status: "none",
      verifiedAt: null,
    };
  } else {
    profile.verificationBadge = {
      label: profile.verificationBadge.label || "Verified",
      status: "verified",
      verifiedAt: profile.verificationBadge.verifiedAt ?? null,
    };
  }

  return {
    ...(data ?? {}),
    isOwner: Boolean(data?.isOwner),
    profile,
  };
}

export { calculateProfileCompletion, getPublicProfileByUsername };
