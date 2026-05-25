import {
  createMarketplaceCategory,
  deleteMarketplaceCategory,
  findMarketplaceCategoryBySlug,
  listMarketplaceCategories,
  updateMarketplaceCategory,
} from "../services/categoryService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMarketplaceCategories = asyncHandler(async (_request, response) => {
  const categories = await listMarketplaceCategories();
  sendSuccess(response, categories);
});

export const getMarketplaceCategoryBySlug = asyncHandler(async (request, response) => {
  const category = await findMarketplaceCategoryBySlug(request.params.slug);
  sendSuccess(response, category);
});

export const getAdminMarketplaceCategories = asyncHandler(async (_request, response) => {
  const categories = await listMarketplaceCategories({ includeInactive: true });
  sendSuccess(response, categories);
});

export const postAdminMarketplaceCategory = asyncHandler(async (request, response) => {
  const category = await createMarketplaceCategory(request.body ?? {});
  sendSuccess(response, category, 201);
});

export const patchAdminMarketplaceCategory = asyncHandler(async (request, response) => {
  const category = await updateMarketplaceCategory(request.params.categoryId, request.body ?? {});
  sendSuccess(response, category);
});

export const deleteAdminMarketplaceCategory = asyncHandler(async (request, response) => {
  const category = await deleteMarketplaceCategory(request.params.categoryId);
  sendSuccess(response, { category, deleted: true });
});
