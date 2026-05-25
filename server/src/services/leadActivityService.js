import { LeadActivity } from "../models/LeadActivity.js";
import { ensureDatabaseConnection } from "./databaseService.js";

export async function createLeadActivity({
  description = "",
  leadId,
  type,
  userId,
}) {
  if (!leadId || !userId) {
    return null;
  }

  ensureDatabaseConnection();

  const activity = await LeadActivity.create({
    description,
    leadId,
    type,
    userId,
  });

  return activity.toObject();
}

export async function findLeadActivitiesForUser(userId, { leadId, limit = 50 } = {}) {
  ensureDatabaseConnection();

  const filter = { userId };

  if (leadId) {
    filter.leadId = leadId;
  }

  return LeadActivity.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
