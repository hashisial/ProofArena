import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { challengeKeys } from "../challenges/useChallenges.js";
import { executionPlanService } from "./executionPlanService.js";

export const executionPlanKeys = Object.freeze({
  challenge: (challengeId, filters = {}) => ["executionPlans", "challenge", challengeId, filters],
  clientDetail: (id) => ["executionPlans", "client", id],
  me: (filters = {}) => ["executionPlans", "me", filters],
  providerDetail: (id) => ["executionPlans", "provider", id],
});

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateProviderPlans(queryClient, id) {
  queryClient.invalidateQueries({ queryKey: ["executionPlans", "me"] });
  if (id) {
    queryClient.invalidateQueries({ queryKey: executionPlanKeys.providerDetail(id) });
  }
}

function invalidateChallengePlans(queryClient, challengeId, planId) {
  queryClient.invalidateQueries({ queryKey: ["executionPlans", "challenge"] });
  queryClient.invalidateQueries({ queryKey: ["challenges", "me"] });
  queryClient.invalidateQueries({ queryKey: ["challenges", "detail"] });
  if (challengeId) {
    queryClient.invalidateQueries({ queryKey: challengeKeys.detail(challengeId) });
  }
  if (planId) {
    queryClient.invalidateQueries({ queryKey: executionPlanKeys.clientDetail(planId) });
  }
}

export function useMyExecutionPlans(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => executionPlanService.getMyExecutionPlans(normalizedFilters),
    queryKey: executionPlanKeys.me(normalizedFilters),
    staleTime: 20_000,
  });
}

export function useExecutionPlan(id) {
  const planId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(planId),
    queryFn: () => executionPlanService.getExecutionPlanByIdForProvider(planId),
    queryKey: executionPlanKeys.providerDetail(planId),
    staleTime: 20_000,
  });
}

export function useChallengePlans(challengeId, filters = {}, options = {}) {
  const normalizedChallengeId = String(challengeId ?? "").trim();
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: Boolean(normalizedChallengeId) && (options.enabled ?? true),
    queryFn: () =>
      executionPlanService.getPlansForClientChallenge(normalizedChallengeId, normalizedFilters),
    queryKey: executionPlanKeys.challenge(normalizedChallengeId, normalizedFilters),
    staleTime: 20_000,
  });
}

export function useClientExecutionPlan(id) {
  const planId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(planId),
    queryFn: () => executionPlanService.getExecutionPlanByIdForClient(planId),
    queryKey: executionPlanKeys.clientDetail(planId),
    staleTime: 20_000,
  });
}

export function useSubmitExecutionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executionPlanService.submitExecutionPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["executionPlans", "me"] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "public"] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "me"] });
      queryClient.invalidateQueries({ queryKey: ["matches", "provider"] });
      if (variables?.challengeId) {
        queryClient.invalidateQueries({ queryKey: challengeKeys.detail(variables.challengeId) });
      }
    },
  });
}

export function useUpdateExecutionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => executionPlanService.updateExecutionPlan(id, payload),
    onSuccess: (_data, variables) => invalidateProviderPlans(queryClient, variables?.id),
  });
}

export function useWithdrawExecutionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executionPlanService.withdrawExecutionPlan,
    onSuccess: (_data, id) => invalidateProviderPlans(queryClient, id),
  });
}

export function useShortlistExecutionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => executionPlanService.shortlistExecutionPlan(id, payload),
    onSuccess: (data, variables) =>
      invalidateChallengePlans(queryClient, data?.challenge?.id, variables?.id),
  });
}

export function useRejectExecutionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => executionPlanService.rejectExecutionPlan(id, payload),
    onSuccess: (data, variables) =>
      invalidateChallengePlans(queryClient, data?.challenge?.id, variables?.id),
  });
}

export function useAcceptExecutionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => executionPlanService.acceptExecutionPlan(id, payload),
    onSuccess: (data, variables) =>
      invalidateChallengePlans(queryClient, data?.challenge?.id, variables?.id),
  });
}
