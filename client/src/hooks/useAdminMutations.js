import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPortfolioItem,
  createService,
} from "../services/api.js";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceData, token }) =>
      createService(serviceData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useCreatePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ portfolioData, token }) =>
      createPortfolioItem(portfolioData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}
