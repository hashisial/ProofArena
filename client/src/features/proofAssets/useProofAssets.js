import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys.js";
import { proofAssetService } from "./proofAssetService.js";

export const proofAssetKeys = queryKeys.proofAssets;

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function invalidateProofAssets(queryClient, id) {
  queryClient.invalidateQueries({ queryKey: proofAssetKeys.meRoot });
  if (id) {
    queryClient.invalidateQueries({ queryKey: proofAssetKeys.detail(id) });
  }
}

export function useMyProofAssets(filters = {}, options = {}) {
  const normalizedFilters = useMemo(() => cleanFilters(filters), [filters]);

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => proofAssetService.getMyProofAssets(normalizedFilters),
    queryKey: proofAssetKeys.me(normalizedFilters),
    staleTime: 20_000,
  });
}

export function useProofAsset(id) {
  const assetId = String(id ?? "").trim();

  return useQuery({
    enabled: Boolean(assetId),
    queryFn: () => proofAssetService.getProofAssetById(assetId),
    queryKey: proofAssetKeys.detail(assetId),
    staleTime: 20_000,
  });
}

export function useCreateProofAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proofAssetService.createProofAsset,
    onSuccess: () => invalidateProofAssets(queryClient),
  });
}

export function useUpdateProofAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => proofAssetService.updateProofAsset(id, payload),
    onSuccess: (_data, variables) => invalidateProofAssets(queryClient, variables?.id),
  });
}

export function useDeleteProofAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proofAssetService.deleteProofAsset,
    onSuccess: (_data, id) => invalidateProofAssets(queryClient, id),
  });
}

export function useAttachProofAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => proofAssetService.attachProofAsset(id, payload),
    onSuccess: (_data, variables) => invalidateProofAssets(queryClient, variables?.id),
  });
}

export function useDetachProofAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => proofAssetService.detachProofAsset(id, payload),
    onSuccess: (_data, variables) => invalidateProofAssets(queryClient, variables?.id),
  });
}
