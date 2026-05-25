import { Campaign } from "../models/Campaign.js";
import { LeadActivity } from "../models/LeadActivity.js";
import { UserActivity } from "../models/UserActivity.js";
import { ensureDatabaseConnection } from "./databaseService.js";

function serializeDate(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function normalizeFeedItem(item) {
  return {
    createdAt: serializeDate(item.createdAt),
    description: item.description,
    id: item.id,
    source: item.source,
    title: item.title,
    type: item.type,
  };
}

export async function findUserActivityFeed(userId, { limit = 30 } = {}) {
  ensureDatabaseConnection();

  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
  const [profileActivities, leadActivities, campaigns] = await Promise.all([
    UserActivity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean(),
    LeadActivity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean(),
    Campaign.find({ userId })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(safeLimit)
      .select("_id title status createdAt updatedAt")
      .lean(),
  ]);

  const feed = [
    ...profileActivities.map((activity) => ({
      createdAt: activity.createdAt,
      description: activity.description,
      id: activity._id.toString(),
      source: "profile",
      title: "Profile update",
      type: activity.type,
    })),
    ...leadActivities.map((activity) => ({
      createdAt: activity.createdAt,
      description: activity.description || "Lead activity recorded.",
      id: activity._id.toString(),
      source: "leads",
      title: "Lead activity",
      type: activity.type,
    })),
    ...campaigns.map((campaign) => ({
      createdAt: campaign.updatedAt ?? campaign.createdAt,
      description:
        campaign.status === "running"
          ? `Campaign started: ${campaign.title}.`
          : `Campaign ${campaign.status}: ${campaign.title}.`,
      id: campaign._id.toString(),
      source: "campaigns",
      title: "Campaign activity",
      type: campaign.status === "running" ? "campaign_started" : "campaign_updated",
    })),
  ];

  return feed
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, safeLimit)
    .map(normalizeFeedItem);
}
