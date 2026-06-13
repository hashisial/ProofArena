import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys.js";
import { dashboardService } from "../features/dashboard/dashboardService.js";
import {
  profileKeys,
  profileService,
  useMyProfile as useFeatureMyProfile,
} from "../features/profile/index.js";

export function useMyActivityFeed(enabled = true) {
  const query = useQuery({
    enabled,
    queryFn: dashboardService.getMyActivityFeed,
    queryKey: queryKeys.dashboard.activityFeed,
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
      queryClient.setQueryData(queryKeys.dashboard.profile, data);
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.activityFeed });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
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
      queryClient.setQueryData(queryKeys.dashboard.profile, data);
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.activityFeed });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}
