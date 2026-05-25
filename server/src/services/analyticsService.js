import mongoose from "mongoose";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Lead } from "../models/Lead.js";
import { getOptionalOwnerFilter } from "../utils/ownerScope.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const MAX_TEXT_LENGTH = 240;

function sanitizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, MAX_TEXT_LENGTH);
}

function sanitizeMetadata(metadata = {}) {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, typeof value === "string" ? sanitizeText(value) : value]),
  );
}

function sanitizeEntityType(entityType) {
  const value = sanitizeText(entityType).toLowerCase();
  const allowed = new Set(["service", "provider", "category", "saved_item", "search", "page", "lead", ""]);

  return allowed.has(value) ? value : "";
}

function getAggregateOwnerFilter(userId) {
  return userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
}

export async function recordPageVisit({ path, referrer, userAgent, userId }) {
  ensureDatabaseConnection();

  return AnalyticsEvent.create({
    entityType: "page",
    eventType: "page_visit",
    type: "page_visit",
    userId: userId ?? null,
    path: sanitizeText(path) || "/",
    referrer: sanitizeText(referrer),
    userAgent: sanitizeText(userAgent),
  });
}

export async function recordFormSubmission(lead) {
  ensureDatabaseConnection();

  return AnalyticsEvent.create({
    entityId: lead?._id?.toString?.() ?? "",
    entityType: "lead",
    eventType: "form_submission",
    type: "form_submission",
    userId: lead?.userId ?? null,
    path: "/contact",
    metadata: sanitizeMetadata({
      leadId: lead?._id?.toString(),
      service: lead?.service,
    }),
  });
}

export async function recordMarketplaceEvent({
  entityId = "",
  entityType = "",
  eventType,
  metadata = {},
  path = "",
  userId,
} = {}) {
  ensureDatabaseConnection();

  const normalizedEventType = sanitizeText(eventType).toLowerCase();

  if (!normalizedEventType) {
    return null;
  }

  return AnalyticsEvent.create({
    entityId: sanitizeText(entityId),
    entityType: sanitizeEntityType(entityType),
    eventType: normalizedEventType,
    metadata: sanitizeMetadata(metadata),
    path: sanitizeText(path),
    type: normalizedEventType,
    userId: userId ?? null,
  });
}

export async function getAnalyticsSummary({ userId } = {}) {
  ensureDatabaseConnection();

  const ownerFilter = getOptionalOwnerFilter(userId);
  const aggregateOwnerFilter = getAggregateOwnerFilter(userId);

  const [visitCount, submissionCount, leadCount, topPages, recentEvents] =
    await Promise.all([
      AnalyticsEvent.countDocuments({ ...ownerFilter, type: "page_visit" }),
      AnalyticsEvent.countDocuments({ ...ownerFilter, type: "form_submission" }),
      Lead.countDocuments(ownerFilter),
      AnalyticsEvent.aggregate([
        {
          $match: {
            ...aggregateOwnerFilter,
            type: "page_visit",
            path: { $ne: "" },
          },
        },
        { $group: { _id: "$path", visits: { $sum: 1 } } },
        { $sort: { visits: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, path: "$_id", visits: 1 } },
      ]),
      AnalyticsEvent.find(ownerFilter)
        .sort({ createdAt: -1 })
        .limit(8)
        .select("userId type path metadata createdAt")
        .lean(),
    ]);

  const conversionRate =
    visitCount > 0 ? Number(((submissionCount / visitCount) * 100).toFixed(1)) : 0;

  return {
    conversionRate,
    formSubmissions: submissionCount,
    leads: leadCount,
    pageVisits: visitCount,
    recentEvents,
    topPages,
  };
}
