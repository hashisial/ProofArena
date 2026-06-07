import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { firstClientService } from "./firstClientService.js";

export const firstClientKeys = Object.freeze({
  badges: () => ["firstClient", "badges"],
  starterChallenges: (filters = {}) => ["firstClient", "starterChallenges", filters],
  status: () => ["firstClient", "status"],
});

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateFirstClient(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["firstClient"] });
  queryClient.invalidateQueries({ queryKey: firstClientKeys.status() });
  queryClient.invalidateQueries({ queryKey: firstClientKeys.badges() });
  queryClient.invalidateQueries({ queryKey: ["firstClient", "starterChallenges"] });
}

export function useFirstClientStatus(options = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: firstClientService.getFirstClientStatus,
    queryKey: firstClientKeys.status(),
    staleTime: 20_000,
  });
}

export function useRefreshFirstClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: firstClientService.refreshFirstClientStatus,
    onSuccess: () => invalidateFirstClient(queryClient),
  });
}

export function useStarterChallenges(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => firstClientService.getStarterChallenges(normalizedFilters),
    queryKey: firstClientKeys.starterChallenges(normalizedFilters),
    staleTime: 20_000,
  });
}

export function useMyBadges(options = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: firstClientService.getMyBadges,
    queryKey: firstClientKeys.badges(),
    staleTime: 20_000,
  });
}
