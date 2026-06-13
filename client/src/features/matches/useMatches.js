import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { matchService } from "./matchService.js";

export const matchKeys = queryKeys.matches;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateProviderMatches(queryClient, id) {
  queryClient.invalidateQueries({ queryKey: matchKeys.providerRoot });
  if (id) {
    queryClient.invalidateQueries({ queryKey: matchKeys.providerDetail(id) });
  }
}

function invalidateChallengeMatches(queryClient, challengeId, id) {
  if (challengeId) {
    queryClient.invalidateQueries({ queryKey: matchKeys.challengeProvidersRoot(challengeId) });
  } else {
    queryClient.invalidateQueries({ queryKey: matchKeys.challengeRoot });
  }

  if (id) {
    queryClient.invalidateQueries({ queryKey: matchKeys.clientDetail(id) });
  }
}

export function useMyMatchedChallenges(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => matchService.getMyMatchedChallenges(normalizedFilters),
    queryKey: matchKeys.provider(normalizedFilters),
    staleTime: 20_000,
  });
}

export function useProviderMatch(id) {
  const matchId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(matchId),
    queryFn: () => matchService.getProviderMatchById(matchId),
    queryKey: matchKeys.providerDetail(matchId),
    staleTime: 20_000,
  });
}

export function useRefreshMyMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchService.refreshMyMatches,
    onSuccess: () => invalidateProviderMatches(queryClient),
  });
}

export function useUpdateProviderMatchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => matchService.updateProviderMatchStatus(id, payload),
    onSuccess: (_data, variables) => invalidateProviderMatches(queryClient, variables?.id),
  });
}

export function useChallengeRecommendedProviders(challengeId, filters = {}, options = {}) {
  const normalizedChallengeId = String(challengeId ?? "").trim();
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: Boolean(normalizedChallengeId) && (options.enabled ?? true),
    queryFn: () => matchService.getChallengeRecommendedProviders(normalizedChallengeId, normalizedFilters),
    queryKey: matchKeys.challengeProviders(normalizedChallengeId, normalizedFilters),
    staleTime: 20_000,
  });
}

export function useRefreshChallengeMatches(challengeId) {
  const queryClient = useQueryClient();
  const normalizedChallengeId = String(challengeId ?? "").trim();

  return useMutation({
    mutationFn: () => matchService.refreshChallengeMatches(normalizedChallengeId),
    onSuccess: () => invalidateChallengeMatches(queryClient, normalizedChallengeId),
  });
}

export function useClientMatch(id) {
  const matchId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(matchId),
    queryFn: () => matchService.getClientMatchById(matchId),
    queryKey: matchKeys.clientDetail(matchId),
    staleTime: 20_000,
  });
}

export function useUpdateClientMatchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => matchService.updateClientMatchStatus(id, payload),
    onSuccess: (data, variables) => {
      invalidateChallengeMatches(queryClient, variables?.challengeId ?? data?.challenge?.id, variables?.id);
    },
  });
}
