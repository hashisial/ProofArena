import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/api.js";

export function useServices() {
  const query = useQuery({
    queryFn: getServices,
    queryKey: ["services"],
  });

  const services = Array.isArray(query.data) ? query.data : [];
  const error = query.error?.message ?? "";

  return {
    error,
    isEmpty: !query.isLoading && !query.isError && services.length === 0,
    isError: query.isError,
    isLoading: query.isLoading,
    isRefetching: query.isFetching && !query.isLoading,
    services,
  };
}
