import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { adminService } from "./adminService.js";

export const adminKeys = queryKeys.admin;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateAdmin(queryClient) {
  return queryClient.invalidateQueries({ queryKey: adminKeys.all });
}

export function useAdminOverview() {
  return useQuery({
    queryFn: adminService.getOverview,
    queryKey: adminKeys.overview,
    staleTime: 20_000,
  });
}

export function useAdminList(resource, filters = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: Boolean(resource),
    queryFn: () => adminService.getList(resource, normalizedFilters),
    queryKey: adminKeys.list(resource, normalizedFilters),
    placeholderData: (previousData) => previousData,
    staleTime: 15_000,
  });
}

export function useAdminModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, resource }) =>
      adminService.moderateResource(resource, id, payload),
    onSuccess: () => invalidateAdmin(queryClient),
  });
}

export function useAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => adminService.updateUserStatus(id, status),
    onSuccess: () => invalidateAdmin(queryClient),
  });
}
