import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { opportunityService } from "./opportunityService.js";

export const opportunityKeys = queryKeys.opportunities;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateOpportunities(queryClient, id) {
  queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
  queryClient.invalidateQueries({ queryKey: opportunityKeys.stats });
  if (id) {
    queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(id) });
  }
}

export function useMyOpportunities(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => opportunityService.getMyOpportunities(normalizedFilters),
    queryKey: opportunityKeys.list(normalizedFilters),
    staleTime: 20_000,
  });
}

export function useOpportunityStats(options = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: opportunityService.getOpportunityStats,
    queryKey: opportunityKeys.stats,
    staleTime: 20_000,
  });
}

export function useOpportunity(id) {
  const opportunityId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(opportunityId),
    queryFn: () => opportunityService.getOpportunityById(opportunityId),
    queryKey: opportunityKeys.detail(opportunityId),
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opportunityService.createOpportunity,
    onSuccess: () => invalidateOpportunities(queryClient),
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => opportunityService.updateOpportunity(id, payload),
    onSuccess: (_data, variables) => invalidateOpportunities(queryClient, variables?.id),
  });
}

export function useUpdateOpportunityStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => opportunityService.updateOpportunityStage(id, payload),
    onSuccess: (_data, variables) => invalidateOpportunities(queryClient, variables?.id),
  });
}

export function useAddOpportunityNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => opportunityService.addOpportunityNote(id, payload),
    onSuccess: (_data, variables) => invalidateOpportunities(queryClient, variables?.id),
  });
}

export function useUpdateNextAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => opportunityService.updateNextAction(id, payload),
    onSuccess: (_data, variables) => invalidateOpportunities(queryClient, variables?.id),
  });
}

export function useCompleteNextAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => opportunityService.completeNextAction(id, payload),
    onSuccess: (_data, variables) => invalidateOpportunities(queryClient, variables?.id),
  });
}

export function useArchiveOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opportunityService.archiveOpportunity,
    onSuccess: (_data, id) => invalidateOpportunities(queryClient, id),
  });
}
