import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitLead } from "../services/api.js";

export function useSubmitLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics-summary"] });
    },
  });
}
