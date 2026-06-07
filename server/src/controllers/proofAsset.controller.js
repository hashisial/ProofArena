import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import * as proofAssetService from "../services/proofAsset.service.js";

export const createProofAsset = asyncHandler(async (request, response) => {
  const asset = await proofAssetService.createProofAsset(request.user.id, request.body, request.file ?? null);
  return successResponse(response, 201, "Proof asset created successfully", asset);
});

export const getMyProofAssets = asyncHandler(async (request, response) => {
  const assets = await proofAssetService.getMyProofAssets(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Proof assets fetched successfully", assets);
});

export const getProofAssetById = asyncHandler(async (request, response) => {
  const asset = await proofAssetService.getProofAssetByIdForOwner(request.user.id, request.params.assetId);
  return successResponse(response, 200, "Proof asset fetched successfully", asset);
});

export const updateProofAsset = asyncHandler(async (request, response) => {
  const asset = await proofAssetService.updateProofAsset(request.user.id, request.params.assetId, request.body);
  return successResponse(response, 200, "Proof asset updated successfully", asset);
});

export const deleteProofAsset = asyncHandler(async (request, response) => {
  const result = await proofAssetService.deleteProofAsset(request.user.id, request.params.assetId);
  return successResponse(response, 200, "Proof asset deleted successfully", result);
});

export const attachProofAssetToContext = asyncHandler(async (request, response) => {
  const asset = await proofAssetService.attachProofAssetToContext(request.user.id, request.params.assetId, request.body);
  return successResponse(response, 200, "Proof asset attached successfully", asset);
});

export const detachProofAssetFromContext = asyncHandler(async (request, response) => {
  const asset = await proofAssetService.detachProofAssetFromContext(request.user.id, request.params.assetId, request.body);
  return successResponse(response, 200, "Proof asset detached successfully", asset);
});
