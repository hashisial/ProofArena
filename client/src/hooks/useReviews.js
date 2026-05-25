import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyReview,
  getMyReviews,
  getReviews,
} from "../services/api.js";

export function useReviews() {
  const query = useQuery({
    queryFn: getReviews,
    queryKey: ["reviews"],
    staleTime: 60_000,
  });

  const reviews = Array.isArray(query.data) ? query.data : [];

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    reviews,
  };
}

export function useMyReviews(enabled = true) {
  const query = useQuery({
    enabled,
    queryFn: getMyReviews,
    queryKey: ["account", "reviews"],
    staleTime: 30_000,
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    reviews: Array.isArray(query.data) ? query.data : [],
  };
}

export function useCreateMyReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMyReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
