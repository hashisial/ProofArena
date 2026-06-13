import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { savedProviderService } from "./savedProviderService.js";

export const savedProviderKeys = queryKeys.savedProviders;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateSavedProviders(queryClient, providerId) {
  queryClient.invalidateQueries({ queryKey: savedProviderKeys.all });
  if (providerId) {
    queryClient.invalidateQueries({ queryKey: savedProviderKeys.status(providerId) });
  }
}

export function useMySavedProviders(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => savedProviderService.getMySavedProviders(normalizedFilters),
    queryKey: savedProviderKeys.me(normalizedFilters),
    staleTime: 20_000,
  });
}

export function useSavedProviderStatus(providerId, options = {}) {
  const normalizedProviderId = String(providerId ?? "").trim();

  return useQuery({
    enabled: Boolean(normalizedProviderId) && (options.enabled ?? true),
    queryFn: () => savedProviderService.getSavedProviderStatus(normalizedProviderId),
    queryKey: savedProviderKeys.status(normalizedProviderId),
    staleTime: 20_000,
  });
}

export function useSaveProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedProviderService.saveProvider,
    onSuccess: (result, variables) =>
      invalidateSavedProviders(queryClient, variables?.providerId ?? result?.providerId),
  });
}

export function useUpdateSavedProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => savedProviderService.updateSavedProvider(id, payload),
    onSuccess: (result) => invalidateSavedProviders(queryClient, result?.providerId),
  });
}

export function useUnsaveProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedProviderService.unsaveProvider,
    onSuccess: (_result, providerId) => invalidateSavedProviders(queryClient, providerId),
  });
}
