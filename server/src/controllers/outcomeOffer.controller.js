import {
  archiveOutcomeOffer as archiveOutcomeOfferService,
  createOutcomeOffer as createOutcomeOfferService,
  deleteOutcomeOffer as deleteOutcomeOfferService,
  getMyOutcomeOffers as getMyOutcomeOffersService,
  getOutcomeOfferByIdForOwner,
  getPublicOutcomeOfferBySlug as getPublicOutcomeOfferBySlugService,
  getPublicOutcomeOffers as getPublicOutcomeOffersService,
  pauseOutcomeOffer as pauseOutcomeOfferService,
  publishOutcomeOffer as publishOutcomeOfferService,
  updateOutcomeOffer as updateOutcomeOfferService,
} from "../services/outcomeOffer.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOutcomeOffer = asyncHandler(async (request, response) => {
  const offer = await createOutcomeOfferService(request.user.id, request.body ?? {});
  return successResponse(response, 201, "Outcome offer created successfully", offer);
});

export const getMyOutcomeOffers = asyncHandler(async (request, response) => {
  const offers = await getMyOutcomeOffersService(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Outcome offers fetched successfully", offers);
});

export const getPublicOutcomeOffers = asyncHandler(async (request, response) => {
  const result = await getPublicOutcomeOffersService(request.query ?? {});
  return successResponse(response, 200, "Outcome offers fetched successfully", result);
});

export const getOutcomeOfferById = asyncHandler(async (request, response) => {
  const offer = await getOutcomeOfferByIdForOwner(request.user.id, request.params.offerId);
  return successResponse(response, 200, "Outcome offer fetched successfully", offer);
});

export const getPublicOutcomeOfferBySlug = asyncHandler(async (request, response) => {
  const offer = await getPublicOutcomeOfferBySlugService(
    request.params.username,
    request.params.slug,
  );
  return successResponse(response, 200, "Outcome offer fetched successfully", offer);
});

export const updateOutcomeOffer = asyncHandler(async (request, response) => {
  const offer = await updateOutcomeOfferService(
    request.user.id,
    request.params.offerId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Outcome offer updated successfully", offer);
});

export const publishOutcomeOffer = asyncHandler(async (request, response) => {
  const offer = await publishOutcomeOfferService(request.user.id, request.params.offerId);
  return successResponse(response, 200, "Outcome offer published successfully", offer);
});

export const pauseOutcomeOffer = asyncHandler(async (request, response) => {
  const offer = await pauseOutcomeOfferService(request.user.id, request.params.offerId);
  return successResponse(response, 200, "Outcome offer paused successfully", offer);
});

export const archiveOutcomeOffer = asyncHandler(async (request, response) => {
  const offer = await archiveOutcomeOfferService(request.user.id, request.params.offerId);
  return successResponse(response, 200, "Outcome offer archived successfully", offer);
});

export const deleteOutcomeOffer = asyncHandler(async (request, response) => {
  const offer = await deleteOutcomeOfferService(request.user.id, request.params.offerId);
  return successResponse(response, 200, "Outcome offer deleted successfully", offer);
});
