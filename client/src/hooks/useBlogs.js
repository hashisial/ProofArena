import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../services/api.js";

export function useBlogs(placement) {
  const query = useQuery({
    queryFn: () => getBlogs(placement),
    queryKey: ["blogs", placement ?? "all"],
    staleTime: 60_000,
  });

  const blogs = Array.isArray(query.data) ? query.data : [];

  return {
    blogs,
    error: query.error?.message ?? "",
    isEmpty: !query.isLoading && !query.isError && blogs.length === 0,
    isError: query.isError,
    isLoading: query.isLoading,
  };
}
