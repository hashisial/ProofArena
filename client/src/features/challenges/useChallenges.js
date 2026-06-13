import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { challengeService } from "./challengeService.js";

export const challengeKeys = queryKeys.challenges;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateMyChallenges(queryClient) {
  queryClient.invalidateQueries({ queryKey: challengeKeys.meRoot });
}

export function useMyChallenges(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => challengeService.getMyChallenges(normalizedFilters),
    queryKey: challengeKeys.me(normalizedFilters),
    staleTime: 20_000,
  });
}

export function usePublicChallenges(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => challengeService.getPublicChallenges(normalizedFilters),
    queryKey: challengeKeys.public(normalizedFilters),
    staleTime: 30_000,
  });
}

export function useChallenge(id) {
  const challengeId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(challengeId),
    queryFn: () => challengeService.getChallengeById(challengeId),
    queryKey: challengeKeys.detail(challengeId),
    staleTime: 20_000,
  });
}

export function usePublicChallenge(username, slug) {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();
  const normalizedSlug = String(slug ?? "").trim().toLowerCase();

  return useQuery({
    enabled: Boolean(normalizedUsername && normalizedSlug),
    queryFn: () => challengeService.getPublicChallengeBySlug(normalizedUsername, normalizedSlug),
    queryKey: challengeKeys.publicDetail(normalizedUsername, normalizedSlug),
    staleTime: 30_000,
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: challengeService.createChallenge,
    onSuccess: () => invalidateMyChallenges(queryClient),
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => challengeService.updateChallenge(id, payload),
    onSuccess: (_data, variables) => {
      invalidateMyChallenges(queryClient);
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: challengeKeys.detail(variables.id) });
      }
    },
  });
}

export function usePublishChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: challengeService.publishChallenge,
    onSuccess: (data, id) => {
      invalidateMyChallenges(queryClient);
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(id) });
      if (data?.client?.username && data?.slug) {
        queryClient.invalidateQueries({
          queryKey: challengeKeys.publicDetail(data.client.username, data.slug),
        });
      }
    },
  });
}

export function usePauseChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: challengeService.pauseChallenge,
    onSuccess: (_data, id) => {
      invalidateMyChallenges(queryClient);
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(id) });
    },
  });
}

export function useCloseChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: challengeService.closeChallenge,
    onSuccess: (_data, id) => {
      invalidateMyChallenges(queryClient);
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(id) });
    },
  });
}

export function useArchiveChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: challengeService.archiveChallenge,
    onSuccess: (_data, id) => {
      invalidateMyChallenges(queryClient);
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(id) });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: challengeService.deleteChallenge,
    onSuccess: (_data, id) => {
      invalidateMyChallenges(queryClient);
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(id) });
    },
  });
}
