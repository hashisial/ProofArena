import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getLeadScrapeJobs, startLeadScrape } from "../services/api.js";

function hasActiveJob(jobs) {
  return jobs.some((job) => ["pending", "running"].includes(job.status));
}

export function useLeadScrapeJobs(enabled = true) {
  const queryClient = useQueryClient();
  const query = useQuery({
    enabled,
    queryFn: getLeadScrapeJobs,
    queryKey: ["account", "lead-scrapes"],
    refetchInterval(queryResult) {
      const jobs = Array.isArray(queryResult.state.data) ? queryResult.state.data : [];
      return hasActiveJob(jobs) ? 3000 : false;
    },
  });

  const jobs = useMemo(
    () => (Array.isArray(query.data) ? query.data : []),
    [query.data],
  );

  useEffect(() => {
    if (!hasActiveJob(jobs)) {
      queryClient.invalidateQueries({ queryKey: ["account", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["account", "leads"] });
    }
  }, [jobs, queryClient]);

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    jobs,
  };
}

export function useStartLeadScrape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startLeadScrape,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "lead-scrapes"] });
    },
  });
}
