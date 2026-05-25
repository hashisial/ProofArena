import {
  findMarketplaceServiceBySlugOrId,
  listFavoritesForUser,
  removeFavoriteForUser,
  saveFavoriteForUser,
  searchMarketplaceServices,
} from "../services/serviceService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMarketplaceServices = asyncHandler(async (request, response) => {
  const result = await searchMarketplaceServices(request.query ?? {}, {
    userId: request.user?.id,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    filters: result.filters,
    pagination: result.pagination,
  });
});

export const getMarketplaceService = asyncHandler(async (request, response) => {
  const slugOrId = request.params.slug ?? request.params.serviceId;
  const service = await findMarketplaceServiceBySlugOrId(slugOrId, {
    userId: request.user?.id,
  });

  sendSuccess(response, service);
});

export const getMyMarketplaceFavorites = asyncHandler(async (request, response) => {
  const favorites = await listFavoritesForUser(request.user.id);
  sendSuccess(response, favorites);
});

export const postMyMarketplaceFavorite = asyncHandler(async (request, response) => {
  const favorite = await saveFavoriteForUser(request.user.id, request.body ?? {});
  sendSuccess(response, favorite, 201);
});

export const deleteMyMarketplaceFavorite = asyncHandler(async (request, response) => {
  const favorite = await removeFavoriteForUser(request.user.id, {
    targetId: request.params.targetId,
    targetType: request.params.targetType,
  });

  sendSuccess(response, favorite);
});
