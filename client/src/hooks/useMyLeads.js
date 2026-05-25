import { useQuery } from "@tanstack/react-query";
import { getMyLeads } from "../services/api.js";

export function useMyLeads(sortOrder = "desc", enabled = true) {
  const query = useQuery({
    enabled,
    queryFn: () => getMyLeads(sortOrder),
    queryKey: ["account", "leads", sortOrder],
  });

  const leads = Array.isArray(query.data) ? query.data : [];

  return {
    error: query.error?.message ?? "",
    isEmpty: !query.isLoading && !query.isError && leads.length === 0,
    isError: query.isError,
    isLoading: query.isLoading,
    leads,
  };
}
