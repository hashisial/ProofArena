import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMyLead,
  deleteMyLead,
  importMyLeads,
  updateMyLead,
} from "../services/api.js";

function invalidateLeadQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["account", "dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["account", "leads"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
}

export function useCreateMyLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMyLead,
    onSuccess: () => invalidateLeadQueries(queryClient),
  });
}

export function useImportMyLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importMyLeads,
    onSuccess: () => invalidateLeadQueries(queryClient),
  });
}

export function useUpdateMyLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, leadData }) => updateMyLead(id, leadData),
    onSuccess: () => invalidateLeadQueries(queryClient),
  });
}

export function useDeleteMyLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyLead,
    onSuccess: () => invalidateLeadQueries(queryClient),
  });
}
