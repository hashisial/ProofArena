import { createUserRecord, findUsers } from "../services/userService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (_request, response) => {
  const users = await findUsers();
  sendSuccess(response, users);
});

export const createUser = asyncHandler(async (request, response) => {
  const user = await createUserRecord(request.body);
  sendSuccess(response, user, 201);
});
