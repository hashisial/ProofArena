import { useQuery } from "@tanstack/react-query";
import { getMyDashboard } from "../services/api.js";

const emptyDashboard = {
  overview: {
    conversionRate: 0,
    conversions: 0,
    emailsSent: 0,
    leads: 0,
    pageVisits: 0,
    activeCampaigns: 0,
    topService: "No requests yet",
  },
  campaigns: [],
  recentActivity: [],
  recentLeads: [],
  subscription: {
    limits: {
      emailsSent: 0,
      apiLimitMonthly: 1000,
      apiRequestsThisMonth: 0,
      leadLimit: 100,
      leads: 0,
      scrapeLimitDaily: 5,
      scrapeLimitMonthly: null,
      scrapeRequestsToday: 0,
      scrapeRequestsThisMonth: 0,
    },
    plan: null,
    subscription: null,
  },
};

export function useMyDashboard(enabled = true) {
  const query = useQuery({
    enabled,
    queryFn: getMyDashboard,
    queryKey: ["account", "dashboard"],
    staleTime: 30_000,
  });

  return {
    dashboard: query.data ?? emptyDashboard,
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
  };
}
