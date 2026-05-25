import {
  findApprovedReviews,
  findReviewsByProvider,
  findReviewsByService,
} from "../services/reviewService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getReviews = asyncHandler(async (_request, response) => {
  const reviews = await findApprovedReviews();
  sendSuccess(response, { items: reviews });
});

export const getServiceReviews = asyncHandler(async (request, response) => {
  const reviews = await findReviewsByService(request.params.serviceId);
  sendSuccess(response, { items: reviews });
});

export const getProviderReviews = asyncHandler(async (request, response) => {
  const reviews = await findReviewsByProvider(request.params.providerId);
  sendSuccess(response, { items: reviews });
});
