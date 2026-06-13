import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { providerService } from "./providerService.js";
import { usePublicProfile } from "../profile/useProfile.js";

export const providerKeys = queryKeys.providers;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function useProviderSearch(filters = {}) {
  return usePublicProviders(filters);
}

export function usePublicProviders(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => providerService.getPublicProviders(normalizedFilters),
    queryKey: providerKeys.public(normalizedFilters),
    keepPreviousData: true,
    staleTime: 20_000,
  });
}

export function useProviderComparison(providerIds = [], options = {}) {
  const normalizedProviderIds = useMemo(
    () =>
      Array.from(
        new Set(
          providerIds
            .map((providerId) => String(providerId ?? "").trim())
            .filter(Boolean),
        ),
      ).slice(0, 4),
    [providerIds],
  );

  return useQuery({
    enabled: normalizedProviderIds.length > 0 && (options.enabled ?? true),
    queryFn: () => providerService.getProviderComparison(normalizedProviderIds),
    queryKey: providerKeys.compare(normalizedProviderIds),
    staleTime: 20_000,
  });
}

export function useProviderFilters() {
  return useQuery({
    queryFn: providerService.getProviderFilters,
    queryKey: providerKeys.filters,
    staleTime: 120_000,
  });
}

export function useProviderPublicProfile(username) {
  return usePublicProfile(username);
}
