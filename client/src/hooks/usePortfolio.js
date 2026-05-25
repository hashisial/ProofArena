import { useQuery } from "@tanstack/react-query";
import { getPortfolio } from "../services/api.js";

export function usePortfolio() {
  const query = useQuery({
    queryFn: getPortfolio,
    queryKey: ["portfolio"],
  });

  const portfolio = Array.isArray(query.data) ? query.data : [];
  const error = query.error?.message ?? "";

  return {
    error,
    isEmpty: !query.isLoading && !query.isError && portfolio.length === 0,
    isError: query.isError,
    isLoading: query.isLoading,
    isRefetching: query.isFetching && !query.isLoading,
    portfolio,
  };
}
