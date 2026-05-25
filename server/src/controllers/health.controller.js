import mongoose from "mongoose";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

function getDatabaseStatus() {
  const statuses = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return statuses[mongoose.connection.readyState] ?? "unknown";
}

export const getApiStatus = asyncHandler((_request, response) =>
  successResponse(response, 200, "ProofArena API is running", {
    name: "ProofArena API",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }),
);

export const getHealthStatus = asyncHandler((_request, response) =>
  successResponse(response, 200, "Health check successful", {
    database: {
      status: getDatabaseStatus(),
    },
    environment: env.nodeEnv,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }),
);

export const getServiceStatus = asyncHandler((_request, response) =>
  successResponse(response, 200, "Service status fetched successfully", {
    service: "ProofArena API",
    status: "online",
  }),
);
