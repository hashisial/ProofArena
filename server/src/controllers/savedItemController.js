import {
  createSavedItemForClient,
  deleteSavedItemForClient,
  listSavedItemsForClient,
} from "../services/savedItemService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSavedItems = asyncHandler(async (request, response) => {
  const result = await listSavedItemsForClient(request.user);

  sendSuccess(response, result);
});

export const postSavedItem = asyncHandler(async (request, response) => {
  const result = await createSavedItemForClient(request.user, request.body ?? {});

  sendSuccess(response, result, 201);
});

export const deleteSavedItem = asyncHandler(async (request, response) => {
  const result = await deleteSavedItemForClient(request.user, request.params.id);

  sendSuccess(response, result);
});
