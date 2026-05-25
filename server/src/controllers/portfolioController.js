import {
  createPortfolioRecord,
  findPortfolioItemById,
  findPortfolioItems,
} from "../services/portfolioService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPortfolioItems = asyncHandler(async (request, response) => {
  const portfolioItems = await findPortfolioItems({ userId: request.user?.id });
  sendSuccess(response, portfolioItems);
});

export const getPortfolioItemById = asyncHandler(async (request, response) => {
  const portfolioItem = await findPortfolioItemById(request.params.id, {
    userId: request.user?.id,
  });
  sendSuccess(response, portfolioItem);
});

export const createPortfolioItem = asyncHandler(async (request, response) => {
  const portfolioItem = await createPortfolioRecord(request.body, {
    userId: request.user?.id,
  });
  sendSuccess(response, portfolioItem, 201);
});
