import mongoose from "mongoose";
import { env } from "../config/env.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHealth = asyncHandler((_request, response) => {
  sendSuccess(response, {
    message: "API is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});
