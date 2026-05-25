import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminPlans,
  getAdminSaasOverview,
  updateAdminPlan,
} from "../services/api.js";

export function useAdminSaasOverview(token) {
  const query = useQuery({
    enabled: Boolean(token),
    queryFn: () => getAdminSaasOverview(token),
    queryKey: ["admin", "saas-overview"],
    staleTime: 30_000,
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    overview: query.data ?? {
      plans: [],
      summary: {},
      users: [],
    },
  };
}

export function useAdminPlans(token) {
  const query = useQuery({
    enabled: Boolean(token),
    queryFn: () => getAdminPlans(token),
    queryKey: ["admin", "plans"],
    staleTime: 30_000,
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    plans: Array.isArray(query.data) ? query.data : [],
  };
}

export function useUpdateAdminPlan(token) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planData, planKey }) => updateAdminPlan(planKey, planData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "saas-overview"] });
      queryClient.invalidateQueries({ queryKey: ["billing", "plans"] });
    },
  });
}
