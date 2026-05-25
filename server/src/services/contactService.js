import { Lead } from "../models/Lead.js";
import { logWarning } from "../utils/logger.js";
import { recordFormSubmission } from "./analyticsService.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { sendLeadNotification } from "./emailService.js";
import { assertLeadLimitForUser } from "./subscriptionService.js";

export async function createLeadInquiry(leadData) {
  ensureDatabaseConnection();

  if (leadData.userId) {
    await assertLeadLimitForUser(leadData.userId, 1);
  }

  const lead = await Lead.create({
    ...leadData,
    userId: leadData.userId ?? null,
  });

  try {
    await recordFormSubmission(lead);
  } catch (error) {
    logWarning("Form submission analytics tracking failed", {
      leadId: lead._id?.toString(),
      message: error.message,
    });
  }

  await sendLeadNotification(lead);

  return lead;
}
