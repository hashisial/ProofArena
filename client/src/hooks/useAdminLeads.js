import { useQuery } from "@tanstack/react-query";
import {
  getAdminAnalyticsSummary,
  getLeadById,
  getLeads,
} from "../services/api.js";

export function useAdminLeads(token, sortOrder = "desc") {
  const query = useQuery({
    enabled: Boolean(token),
    queryFn: () => getLeads(token, sortOrder),
    queryKey: ["admin", "leads", sortOrder],
    staleTime: 30_000,
  });

  return {
    error: query.error?.message ?? "",
    isEmpty: !query.isLoading && !query.isError && (query.data?.length ?? 0) === 0,
    isError: query.isError,
    isLoading: query.isLoading,
    isRefetching: query.isFetching && !query.isLoading,
    leads: Array.isArray(query.data) ? query.data : [],
  };
}

export function useAdminLead(token, leadId) {
  return useQuery({
    enabled: Boolean(token && leadId),
    queryFn: () => getLeadById(leadId, token),
    queryKey: ["admin", "lead", leadId],
  });
}

export function useAdminAnalyticsSummary(token) {
  const query = useQuery({
    enabled: Boolean(token),
    queryFn: () => getAdminAnalyticsSummary(token),
    queryKey: ["admin", "analytics-summary"],
    staleTime: 30_000,
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    summary: query.data ?? {
      conversionRate: 0,
      formSubmissions: 0,
      leads: 0,
      pageVisits: 0,
      recentEvents: [],
      topPages: [],
    },
  };
}
