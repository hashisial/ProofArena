import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { useAuth } from "../auth/useAuth.js";
import { profileService } from "./profileService.js";

export const profileKeys = queryKeys.profile;

export function useMyProfile(enabled = true) {
  return useQuery({
    enabled,
    queryFn: profileService.getMyProfile,
    queryKey: profileKeys.me,
    staleTime: 30_000,
  });
}

export const useOwnerProfile = useMyProfile;

export function usePublicProfile(username) {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();

  return useQuery({
    enabled: Boolean(normalizedUsername),
    queryFn: () => profileService.getPublicProfile(normalizedUsername),
    queryKey: profileKeys.public(normalizedUsername),
    staleTime: 60_000,
  });
}

export function usePublishedPublicProfile(identifier) {
  const normalizedIdentifier = String(identifier ?? "").trim().toLowerCase();

  return useQuery({
    enabled: Boolean(normalizedIdentifier),
    queryFn: () => profileService.getPublishedPublicProfile(normalizedIdentifier),
    queryKey: profileKeys.publishedPublic(normalizedIdentifier),
    staleTime: 60_000,
  });
}

export function usePublicProfilePreview(enabled = true) {
  return useQuery({
    enabled,
    queryFn: profileService.getMyPublicProfilePreview,
    queryKey: profileKeys.publicPreview,
    staleTime: 30_000,
  });
}

export function useMyProfileAnalytics(enabled = true) {
  return useQuery({
    enabled,
    queryFn: profileService.getMyProfileAnalytics,
    queryKey: profileKeys.analytics,
    staleTime: 30_000,
  });
}

export function usePublicProfileActivity(username, enabled = true) {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();

  return useQuery({
    enabled: enabled && Boolean(normalizedUsername),
    queryFn: () => profileService.getPublicProfileActivity(normalizedUsername),
    queryKey: profileKeys.publicActivity(normalizedUsername),
    staleTime: 60_000,
  });
}

export function useVerificationStatus(enabled = true) {
  return useQuery({
    enabled,
    queryFn: profileService.getVerificationStatus,
    queryKey: profileKeys.verification,
    staleTime: 30_000,
  });
}

export function usePrivacySettings(enabled = true) {
  return useQuery({
    enabled,
    queryFn: profileService.getPrivacySettings,
    queryKey: profileKeys.privacy,
    staleTime: 30_000,
  });
}

function invalidateOwnerProfile(queryClient) {
  queryClient.invalidateQueries({ queryKey: profileKeys.me });
}

function updateProfileQueries(queryClient, profileData) {
  queryClient.setQueryData(profileKeys.me, profileData);
  invalidateOwnerProfile(queryClient);
  queryClient.invalidateQueries({ queryKey: profileKeys.analytics });
  queryClient.invalidateQueries({ queryKey: profileKeys.verification });
  queryClient.invalidateQueries({ queryKey: profileKeys.privacy });
  if (profileData?.user?.username) {
    queryClient.invalidateQueries({
      queryKey: profileKeys.public(profileData.user.username),
    });
  }
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: profileService.updateMyProfile,
    onSuccess: (profileData) => {
      queryClient.setQueryData(profileKeys.me, profileData);
      invalidateOwnerProfile(queryClient);
      if (profileData?.user) {
        updateUser(profileData.user);
      }
    },
  });
}

export const useUpdateOwnerProfile = useUpdateProfile;

export function useUpdateProfileSection() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: profileService.updateProfileSection,
    onSuccess: (profileData) => {
      updateProfileQueries(queryClient, profileData);
      queryClient.invalidateQueries({ queryKey: profileKeys.publicPreview });
      if (profileData?.user) {
        updateUser(profileData.user);
      }
    },
  });
}

export function useUpdateOnboardingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateOnboardingProgress,
    onSuccess: (profileData) => {
      updateProfileQueries(queryClient, profileData);
      queryClient.invalidateQueries({ queryKey: profileKeys.onboardingProgress });
    },
  });
}

export function useUpdateProfilePublishState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfilePublishState,
    onSuccess: (profileData) => {
      updateProfileQueries(queryClient, profileData);
      queryClient.invalidateQueries({ queryKey: profileKeys.publicPreview });
      if (profileData?.user?.username) {
        queryClient.invalidateQueries({
          queryKey: profileKeys.publishedPublic(profileData.user.username),
        });
      }
    },
  });
}

export function useUpdateIntro() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: profileService.updateIntro,
    onSuccess: (profileData) => {
      queryClient.setQueryData(profileKeys.me, profileData);
      invalidateOwnerProfile(queryClient);
      if (profileData?.user) {
        updateUser(profileData.user);
      }
    },
  });
}

export const useUpdateProfileIntro = useUpdateIntro;

export function useUpdateAbout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateAbout,
    onSuccess: (profileData) => {
      updateProfileQueries(queryClient, profileData);
    },
  });
}

export const useUpdateProfileAbout = useUpdateAbout;

export function useUpdateSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateSkills,
    onSuccess: (profileData) => {
      updateProfileQueries(queryClient, profileData);
    },
  });
}

export const useUpdateProfileSkills = useUpdateSkills;

export function useAddExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.addExperience,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateExperience,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.deleteExperience,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useAddEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.addEducation,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateEducation,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.deleteEducation,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useAddService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.addService,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateService,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.deleteService,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useUpdateOpenTo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateOpenTo,
    onSuccess: (profileData) => updateProfileQueries(queryClient, profileData),
  });
}

export function useRequestVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.requestVerification,
    onSuccess: () => {
      invalidateOwnerProfile(queryClient);
      queryClient.invalidateQueries({ queryKey: profileKeys.analytics });
      queryClient.invalidateQueries({ queryKey: profileKeys.verification });
    },
  });
}

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updatePrivacySettings,
    onSuccess: (privacyData) => {
      queryClient.setQueryData(profileKeys.privacy, privacyData);
      invalidateOwnerProfile(queryClient);
      queryClient.invalidateQueries({ queryKey: profileKeys.privacy });
    },
  });
}

export function useUploadProfileAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: ({ file, formData, onUploadProgress }) =>
      profileService.updateAvatar(file ?? formData, onUploadProgress),
    onSuccess: (profileData) => {
      queryClient.setQueryData(profileKeys.me, (current) => ({
        ...(current ?? {}),
        ...profileData,
      }));
      invalidateOwnerProfile(queryClient);

      if (profileData?.user) {
        updateUser(profileData.user);
      }
    },
  });
}

export const useUpdateAvatar = useUploadProfileAvatar;

export function useUploadProfileCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, formData, onUploadProgress }) =>
      profileService.updateCoverImage(file ?? formData, onUploadProgress),
    onSuccess: (profileData) => {
      queryClient.setQueryData(profileKeys.me, (current) => ({
        ...(current ?? {}),
        ...profileData,
      }));
      invalidateOwnerProfile(queryClient);
    },
  });
}

export const useUpdateCoverImage = useUploadProfileCover;
