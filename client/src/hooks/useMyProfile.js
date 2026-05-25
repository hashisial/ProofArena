import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyActivityFeed } from "../services/api.js";
import {
  profileKeys,
  profileService,
  useMyProfile as useFeatureMyProfile,
} from "../features/profile/index.js";

export function useMyActivityFeed(enabled = true) {
  const query = useQuery({
    enabled,
    queryFn: getMyActivityFeed,
    queryKey: ["account", "activity-feed"],
    staleTime: 15_000,
  });

  return {
    activities: Array.isArray(query.data) ? query.data : [],
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
  };
}

export function useMyProfile(enabled = true) {
  const query = useFeatureMyProfile(enabled);

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    profileData: query.data ?? null,
  };
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me, data);
      queryClient.setQueryData(["account", "profile"], data);
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: ["account", "activity-feed"] });
      queryClient.invalidateQueries({ queryKey: ["account", "dashboard"] });
    },
  });
}

export function useUploadMyProfileMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, type }) => {
      const formData = new FormData();
      formData.append("image", file);

      return type === "avatar"
        ? profileService.uploadAvatar(formData)
        : profileService.uploadCover(formData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me, data);
      queryClient.setQueryData(["account", "profile"], data);
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: ["account", "activity-feed"] });
      queryClient.invalidateQueries({ queryKey: ["account", "dashboard"] });
    },
  });
}
