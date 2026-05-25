import {
  getAnalyticsSummary,
  recordMarketplaceEvent,
  recordPageVisit,
} from "../services/analyticsService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const trackPageVisit = asyncHandler(async (request, response) => {
  await recordPageVisit({
    path: request.body?.path,
    referrer: request.body?.referrer,
    userAgent: request.get("user-agent"),
    userId: request.user?.id,
  });

  sendSuccess(response, { tracked: true }, 201);
});

export const trackMarketplaceEvent = asyncHandler(async (request, response) => {
  await recordMarketplaceEvent({
    entityId: request.body?.entityId,
    entityType: request.body?.entityType,
    eventType: request.body?.eventType,
    metadata: request.body?.metadata,
    path: request.body?.path,
    userId: request.user?.id,
  });

  sendSuccess(response, { tracked: true }, 201);
});

export const getAdminAnalyticsSummary = asyncHandler(async (_request, response) => {
  const summary = await getAnalyticsSummary();
  sendSuccess(response, summary);
});
