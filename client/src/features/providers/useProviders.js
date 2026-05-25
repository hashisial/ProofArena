import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { providerService } from "./providerService.js";

export const providerKeys = Object.freeze({
  all: ["providers"],
  search: (filters) => ["providers", "search", filters],
});

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function useProviderSearch(filters = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    queryFn: () => providerService.searchProviders(normalizedFilters),
    queryKey: providerKeys.search(normalizedFilters),
    keepPreviousData: true,
    staleTime: 20_000,
  });
}
