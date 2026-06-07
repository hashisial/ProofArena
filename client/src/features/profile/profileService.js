import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

function normalizeLocation(location) {
  if (typeof location === "string") {
    return {
      city: location,
      country: "",
      state: "",
      timezone: "",
    };
  }

  return {
    city: location?.city ?? "",
    country: location?.country ?? "",
    state: location?.state ?? "",
    timezone: location?.timezone ?? "",
  };
}

function normalizeMedia(media) {
  if (typeof media === "string") {
    return {
      publicId: "",
      url: media,
    };
  }

  return {
    publicId: media?.publicId ?? "",
    url: media?.url ?? "",
  };
}

function normalizeSkill(skill, index) {
  if (typeof skill === "string") {
    return {
      endorsementsCount: 0,
      isFeatured: false,
      name: skill,
      order: index,
    };
  }

  return {
    endorsementsCount: skill?.endorsementsCount ?? 0,
    isFeatured: Boolean(skill?.isFeatured),
    name: skill?.name ?? "",
    order: skill?.order ?? index,
  };
}

function createImageFormData(input, fieldName) {
  if (typeof FormData !== "undefined" && input instanceof FormData) {
    return input;
  }

  const file = input?.file ?? input;
  const formData = new FormData();
  formData.append(fieldName, file);

  return formData;
}

export function normalizeProfileData(data = {}) {
  const profile = data.profile ?? {};
  const providerProfile = data.providerProfile ?? null;
  const user = data.user ?? {};

  return {
    ...data,
    isOwner: Boolean(data.isOwner),
    providerProfile,
    user: {
      ...user,
      avatar: normalizeMedia(user.avatar),
      fullName: user.fullName || user.name || user.username || "ProofArena Member",
      username: user.username || "member",
    },
    profile: {
      ...profile,
      analytics: {
        lastViewedAt: profile.analytics?.lastViewedAt ?? profile.lastViewedAt ?? null,
        postImpressions: profile.analytics?.postImpressions ?? profile.postImpressions ?? 0,
        profileViews: profile.analytics?.profileViews ?? profile.profileViews ?? 0,
        searchAppearances: profile.analytics?.searchAppearances ?? profile.searchAppearances ?? 0,
      },
      activitySummary: {
        commentsCount: profile.activitySummary?.commentsCount ?? 0,
        lastActiveAt: profile.activitySummary?.lastActiveAt ?? null,
        milestoneUpdatesCount: profile.activitySummary?.milestoneUpdatesCount ?? 0,
        postsCount: profile.activitySummary?.postsCount ?? 0,
        proofUpdatesCount: profile.activitySummary?.proofUpdatesCount ?? 0,
      },
      bio: profile.bio ?? "",
      coverImage: normalizeMedia(profile.coverImage),
      headline: profile.headline || providerProfile?.headline || "Outcome-driven professional on ProofArena",
      location: normalizeLocation(profile.location),
      openTo: {
        categories: profile.openTo?.categories ?? [],
        enabled: Boolean(profile.openTo?.enabled),
        note: profile.openTo?.note ?? "",
        title: profile.openTo?.title ?? "",
      },
      profileCompletion:
        typeof profile.profileCompletion === "number"
          ? { missingFields: [], percentage: profile.profileCompletion }
          : {
              missingFields: profile.profileCompletion?.missingFields ?? [],
              percentage: profile.profileCompletion?.percentage ?? 0,
            },
      services: Array.isArray(profile.services) ? profile.services : [],
      skills: (profile.skills ?? []).map(normalizeSkill).filter((skill) => skill.name),
      verification: profile.verification ?? {
        isVerified: false,
        label: "",
        type: "none",
        verifiedAt: null,
      },
      verificationBadge: {
        label: profile.verificationBadge?.label ?? "Verified",
        rejectedAt: profile.verificationBadge?.rejectedAt ?? null,
        rejectionReason: profile.verificationBadge?.rejectionReason ?? "",
        requestNote: profile.verificationBadge?.requestNote ?? "",
        requestedAt: profile.verificationBadge?.requestedAt ?? null,
        reviewedAt: profile.verificationBadge?.reviewedAt ?? null,
        reviewedBy: profile.verificationBadge?.reviewedBy ?? null,
        status: profile.verificationBadge?.status ?? "none",
        supportingLinks: profile.verificationBadge?.supportingLinks ?? [],
        verificationType: profile.verificationBadge?.verificationType ?? "identity",
        verifiedAt: profile.verificationBadge?.verifiedAt ?? null,
        website: profile.verificationBadge?.website ?? "",
      },
    },
  };
}

export const profileService = Object.freeze({
  async getMyProfile() {
    return normalizeProfileData(await api.get(API_ENDPOINTS.PROFILE_ME));
  },
  async getOwnerProfile() {
    return normalizeProfileData(await api.get(API_ENDPOINTS.PROFILE_ME));
  },
  async getPublicProfile(username) {
    return normalizeProfileData(
      await api.get(API_ENDPOINTS.PROFILE_PUBLIC_BY_USERNAME(username), {
        skipUserAuth: true,
      }),
    );
  },
  async getMyProfileAnalytics() {
    return api.get(API_ENDPOINTS.PROFILE_ANALYTICS);
  },
  async getPublicProfileActivity(username) {
    return api.get(API_ENDPOINTS.PROFILE_PUBLIC_ACTIVITY(username), {
      skipUserAuth: true,
    });
  },
  async getVerificationStatus() {
    return api.get(API_ENDPOINTS.PROFILE_VERIFICATION);
  },
  async getPrivacySettings() {
    return api.get(API_ENDPOINTS.PROFILE_PRIVACY);
  },
  async requestVerification(payload) {
    return api.post(API_ENDPOINTS.PROFILE_VERIFICATION_REQUEST, payload);
  },
  async updatePrivacySettings(payload) {
    return api.patch(API_ENDPOINTS.PROFILE_PRIVACY, payload);
  },
  async updateAbout(payload) {
    return normalizeProfileData(await api.patch(API_ENDPOINTS.PROFILE_ABOUT, payload));
  },
  async updateSkills(payload) {
    return normalizeProfileData(await api.patch(API_ENDPOINTS.PROFILE_SKILLS, payload));
  },
  async addExperience(payload) {
    return normalizeProfileData(await api.post(API_ENDPOINTS.PROFILE_EXPERIENCE, payload));
  },
  async updateExperience({ experienceId, payload }) {
    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_EXPERIENCE_ITEM(experienceId), payload),
    );
  },
  async deleteExperience(experienceId) {
    return normalizeProfileData(
      await api.delete(API_ENDPOINTS.PROFILE_EXPERIENCE_ITEM(experienceId)),
    );
  },
  async addEducation(payload) {
    return normalizeProfileData(await api.post(API_ENDPOINTS.PROFILE_EDUCATION, payload));
  },
  async updateEducation({ educationId, payload }) {
    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_EDUCATION_ITEM(educationId), payload),
    );
  },
  async deleteEducation(educationId) {
    return normalizeProfileData(
      await api.delete(API_ENDPOINTS.PROFILE_EDUCATION_ITEM(educationId)),
    );
  },
  async addService(payload) {
    return normalizeProfileData(await api.post(API_ENDPOINTS.PROFILE_SERVICES, payload));
  },
  async updateService({ serviceId, payload }) {
    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_SERVICE_ITEM(serviceId), payload),
    );
  },
  async deleteService(serviceId) {
    return normalizeProfileData(
      await api.delete(API_ENDPOINTS.PROFILE_SERVICE_ITEM(serviceId)),
    );
  },
  async updateOpenTo(payload) {
    return normalizeProfileData(await api.patch(API_ENDPOINTS.PROFILE_OPEN_TO, payload));
  },
  async updateIntro(payload) {
    return normalizeProfileData(await api.patch(API_ENDPOINTS.PROFILE_INTRO, payload));
  },
  async updateMyProfile(payload) {
    return normalizeProfileData(await api.patch(API_ENDPOINTS.PROFILE_UPDATE_ME, payload));
  },
  async updateOwnerProfile(payload) {
    return normalizeProfileData(await api.patch(API_ENDPOINTS.PROFILE_UPDATE_ME, payload));
  },
  async updateAvatar(file, onUploadProgress) {
    const formData = createImageFormData(file, "avatar");

    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_AVATAR, formData, { onUploadProgress }),
    );
  },
  async updateCoverImage(file, onUploadProgress) {
    const formData = createImageFormData(file, "cover");

    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_COVER, formData, { onUploadProgress }),
    );
  },
  async uploadAvatar(file, onUploadProgress) {
    const formData = createImageFormData(file, "avatar");

    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_AVATAR, formData, { onUploadProgress }),
    );
  },
  async uploadCover(file, onUploadProgress) {
    const formData = createImageFormData(file, "cover");

    return normalizeProfileData(
      await api.patch(API_ENDPOINTS.PROFILE_COVER, formData, { onUploadProgress }),
    );
  },
});

export const getMyProfile = profileService.getMyProfile;
export const getOwnerProfile = profileService.getOwnerProfile;
export const getPublicProfile = profileService.getPublicProfile;
export const getMyProfileAnalytics = profileService.getMyProfileAnalytics;
export const getPublicProfileActivity = profileService.getPublicProfileActivity;
export const getVerificationStatus = profileService.getVerificationStatus;
export const getPrivacySettings = profileService.getPrivacySettings;
export const requestVerification = profileService.requestVerification;
export const updatePrivacySettings = profileService.updatePrivacySettings;
export const updateAbout = profileService.updateAbout;
export const updateSkills = profileService.updateSkills;
export const addExperience = profileService.addExperience;
export const updateExperience = profileService.updateExperience;
export const deleteExperience = profileService.deleteExperience;
export const addEducation = profileService.addEducation;
export const updateEducation = profileService.updateEducation;
export const deleteEducation = profileService.deleteEducation;
export const addService = profileService.addService;
export const updateService = profileService.updateService;
export const deleteService = profileService.deleteService;
export const updateOpenTo = profileService.updateOpenTo;
export const updateIntro = profileService.updateIntro;
export const updateAvatar = profileService.updateAvatar;
export const updateCoverImage = profileService.updateCoverImage;
export const updateMyProfile = profileService.updateMyProfile;
export const updateOwnerProfile = profileService.updateOwnerProfile;
export const uploadAvatar = profileService.uploadAvatar;
export const uploadCover = profileService.uploadCover;
