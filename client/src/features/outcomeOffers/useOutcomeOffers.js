import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "../profile/useProfile.js";
import { outcomeOfferService } from "./outcomeOfferService.js";

export const outcomeOfferKeys = Object.freeze({
  detail: (id) => ["outcomeOffers", "detail", id],
  me: (filters = {}) => ["outcomeOffers", "me", filters],
  public: (filters = {}) => ["outcomeOffers", "public", filters],
  publicDetail: (username, slug) => ["outcomeOffers", "public", username, slug],
});

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateMyOffers(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["outcomeOffers", "me"] });
  queryClient.invalidateQueries({ queryKey: profileKeys.me });
}

export function useMyOutcomeOffers(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => outcomeOfferService.getMyOutcomeOffers(normalizedFilters),
    queryKey: outcomeOfferKeys.me(normalizedFilters),
    staleTime: 20_000,
  });
}

export function usePublicOutcomeOffers(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => outcomeOfferService.getPublicOutcomeOffers(normalizedFilters),
    queryKey: outcomeOfferKeys.public(normalizedFilters),
    staleTime: 30_000,
  });
}

export function useOutcomeOffer(id) {
  const offerId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(offerId),
    queryFn: () => outcomeOfferService.getOutcomeOfferById(offerId),
    queryKey: outcomeOfferKeys.detail(offerId),
    staleTime: 20_000,
  });
}

export function usePublicOutcomeOffer(username, slug) {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();
  const normalizedSlug = String(slug ?? "").trim().toLowerCase();

  return useQuery({
    enabled: Boolean(normalizedUsername && normalizedSlug),
    queryFn: () => outcomeOfferService.getPublicOutcomeOfferBySlug(normalizedUsername, normalizedSlug),
    queryKey: outcomeOfferKeys.publicDetail(normalizedUsername, normalizedSlug),
    staleTime: 30_000,
  });
}

export function useCreateOutcomeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outcomeOfferService.createOutcomeOffer,
    onSuccess: () => invalidateMyOffers(queryClient),
  });
}

export function useUpdateOutcomeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => outcomeOfferService.updateOutcomeOffer(id, payload),
    onSuccess: (_data, variables) => {
      invalidateMyOffers(queryClient);
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: outcomeOfferKeys.detail(variables.id) });
      }
    },
  });
}

export function usePublishOutcomeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outcomeOfferService.publishOutcomeOffer,
    onSuccess: (data, id) => {
      invalidateMyOffers(queryClient);
      queryClient.invalidateQueries({ queryKey: outcomeOfferKeys.detail(id) });
      if (data?.provider?.username && data?.slug) {
        queryClient.invalidateQueries({
          queryKey: outcomeOfferKeys.publicDetail(data.provider.username, data.slug),
        });
      }
    },
  });
}

export function usePauseOutcomeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outcomeOfferService.pauseOutcomeOffer,
    onSuccess: (_data, id) => {
      invalidateMyOffers(queryClient);
      queryClient.invalidateQueries({ queryKey: outcomeOfferKeys.detail(id) });
    },
  });
}

export function useArchiveOutcomeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outcomeOfferService.archiveOutcomeOffer,
    onSuccess: (_data, id) => {
      invalidateMyOffers(queryClient);
      queryClient.invalidateQueries({ queryKey: outcomeOfferKeys.detail(id) });
    },
  });
}

export function useDeleteOutcomeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outcomeOfferService.deleteOutcomeOffer,
    onSuccess: (_data, id) => {
      invalidateMyOffers(queryClient);
      queryClient.invalidateQueries({ queryKey: outcomeOfferKeys.detail(id) });
    },
  });
}
