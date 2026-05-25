import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplates,
  getOutreachEmails,
  getOutreachJobs,
  sendOutreachEmail,
  startOutreachAutomation,
  updateEmailTemplate,
} from "../services/api.js";

function hasActiveOutreachJob(jobs) {
  return jobs.some((job) => ["queued", "running"].includes(job.status));
}

function invalidateOutreach(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["account", "outreach-emails"] });
  queryClient.invalidateQueries({ queryKey: ["account", "outreach-jobs"] });
}

export function useEmailTemplates() {
  const query = useQuery({
    queryFn: getEmailTemplates,
    queryKey: ["account", "email-templates"],
  });

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    templates: Array.isArray(query.data) ? query.data : [],
  };
}

export function useOutreachEmails() {
  const query = useQuery({
    queryFn: getOutreachEmails,
    queryKey: ["account", "outreach-emails"],
    refetchInterval(queryResult) {
      const emails = Array.isArray(queryResult.state.data) ? queryResult.state.data : [];
      return emails.some((email) => email.status === "queued") ? 3000 : false;
    },
  });

  return {
    emails: Array.isArray(query.data) ? query.data : [],
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
  };
}

export function useOutreachJobs() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: getOutreachJobs,
    queryKey: ["account", "outreach-jobs"],
    refetchInterval(queryResult) {
      const jobs = Array.isArray(queryResult.state.data) ? queryResult.state.data : [];
      return hasActiveOutreachJob(jobs) ? 3000 : false;
    },
  });

  const jobs = useMemo(
    () => (Array.isArray(query.data) ? query.data : []),
    [query.data],
  );

  useEffect(() => {
    if (!hasActiveOutreachJob(jobs)) {
      queryClient.invalidateQueries({ queryKey: ["account", "outreach-emails"] });
    }
  }, [jobs, queryClient]);

  return {
    error: query.error?.message ?? "",
    isError: query.isError,
    isLoading: query.isLoading,
    jobs,
  };
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "email-templates"] });
    },
  });
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, templateData }) => updateEmailTemplate(id, templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "email-templates"] });
    },
  });
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "email-templates"] });
    },
  });
}

export function useSendOutreachEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendOutreachEmail,
    onSuccess: () => invalidateOutreach(queryClient),
  });
}

export function useStartOutreachAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startOutreachAutomation,
    onSuccess: () => invalidateOutreach(queryClient),
  });
}
