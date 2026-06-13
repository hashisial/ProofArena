import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys.js";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getMySubscription,
  getSubscriptionPlans,
  selectFreePlan,
} from "../services/api.js";

export function useSubscriptionPlans() {
  const query = useQuery({
    queryFn: getSubscriptionPlans,
    queryKey: queryKeys.billing.plans(),
    staleTime: 60_000,
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    plans: Array.isArray(query.data) ? query.data : [],
  };
}

export function useMySubscription(enabled = true) {
  const query = useQuery({
    enabled,
    queryFn: getMySubscription,
    queryKey: queryKeys.billing.subscription(),
    staleTime: 30_000,
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    subscription: query.data ?? null,
  };
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: createCheckoutSession,
  });
}

export function useCreateCustomerPortalSession() {
  return useMutation({
    mutationFn: createCustomerPortalSession,
  });
}

export function useSelectFreePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selectFreePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
      queryClient.invalidateQueries({ queryKey: ["account", "dashboard"] });
    },
  });
}
