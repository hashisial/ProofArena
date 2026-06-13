import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { profileKeys } from "../profile/useProfile.js";
import { socialService } from "./socialService.js";

export const socialKeys = queryKeys.social;

function normalizeUserId(userId) {
  return String(userId ?? "").trim();
}

export function useConnectionStatus(userId, enabled = true) {
  const targetUserId = normalizeUserId(userId);

  return useQuery({
    enabled: enabled && Boolean(targetUserId),
    queryFn: () => socialService.getConnectionStatus(targetUserId),
    queryKey: socialKeys.connectionStatus(targetUserId),
    staleTime: 30_000,
  });
}

export function useFollowStatus(userId, enabled = true) {
  const targetUserId = normalizeUserId(userId);

  return useQuery({
    enabled: enabled && Boolean(targetUserId),
    queryFn: () => socialService.getFollowStatus(targetUserId),
    queryKey: socialKeys.followStatus(targetUserId),
    staleTime: 30_000,
  });
}

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialService.sendConnectionRequest,
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: socialKeys.connectionStatus(normalizeUserId(userId)) });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}

export function useRemoveConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialService.removeConnection,
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: socialKeys.connectionStatus(normalizeUserId(userId)) });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}

export function useFollowUser(username) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialService.followUser,
    onSuccess: (_data, userId) => {
      const targetUserId = normalizeUserId(userId);
      queryClient.invalidateQueries({ queryKey: socialKeys.followStatus(targetUserId) });
      if (username) {
        queryClient.invalidateQueries({ queryKey: profileKeys.public(username) });
      }
    },
  });
}

export function useUnfollowUser(username) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialService.unfollowUser,
    onSuccess: (_data, userId) => {
      const targetUserId = normalizeUserId(userId);
      queryClient.invalidateQueries({ queryKey: socialKeys.followStatus(targetUserId) });
      if (username) {
        queryClient.invalidateQueries({ queryKey: profileKeys.public(username) });
      }
    },
  });
}
