import { QUEUE_NAMES } from "../constants/queueNames.js";
import { Campaign } from "../models/Campaign.js";
import { Lead } from "../models/Lead.js";
import { Notification } from "../models/Notification.js";
import { OutreachEmail } from "../models/OutreachEmail.js";
import { AppError } from "../utils/AppError.js";
import { logWarning } from "../utils/logger.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { sendOutboundEmail, toBasicHtml } from "./emailService.js";
import { createLeadActivity } from "./leadActivityService.js";
import { enqueueJob, registerQueueProcessor } from "./queueService.js";
import { assertEmailLimitForUser } from "./subscriptionService.js";

const campaignStatuses = new Set(["draft", "running", "paused", "completed"]);

function normalizeCampaignData(campaignData = {}, { partial = false } = {}) {
  const normalizedCampaign = {};

  ["title", "subject", "template"].forEach((field) => {
    if (campaignData[field] !== undefined) {
      normalizedCampaign[field] = String(campaignData[field] ?? "").trim();
    }
  });

  if (campaignData.status !== undefined) {
    normalizedCampaign.status = String(campaignData.status ?? "").trim().toLowerCase();
  }

  if (campaignData.scheduledAt !== undefined) {
    normalizedCampaign.scheduledAt = campaignData.scheduledAt
      ? new Date(campaignData.scheduledAt)
      : null;
  }

  if (campaignData.leads !== undefined) {
    normalizedCampaign.leads = Array.isArray(campaignData.leads)
      ? campaignData.leads.filter(Boolean)
      : [];
  }

  if (!partial || normalizedCampaign.title !== undefined) {
    if (!normalizedCampaign.title) {
      throw new AppError("Campaign title is required", 400);
    }
  }

  if (!partial || normalizedCampaign.subject !== undefined) {
    if (!normalizedCampaign.subject) {
      throw new AppError("Campaign subject is required", 400);
    }
  }

  if (!partial || normalizedCampaign.template !== undefined) {
    if (!normalizedCampaign.template) {
      throw new AppError("Campaign template is required", 400);
    }
  }

  if (normalizedCampaign.status && !campaignStatuses.has(normalizedCampaign.status)) {
    throw new AppError("Campaign status is invalid", 400);
  }

  return normalizedCampaign;
}

function renderTemplate(content, lead) {
  const replacements = {
    company: lead.company || "your team",
    email: lead.email || "",
    fullName: lead.fullName || lead.name || "there",
    industry: lead.industry || "",
    name: lead.fullName || lead.name || "there",
    phone: lead.phone || "",
  };

  return String(content ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return replacements[key] ?? "";
  });
}

async function getCampaignForUser(userId, campaignId) {
  const campaign = await Campaign.findOne({ _id: campaignId, userId });

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  return campaign;
}

async function getCampaignLeads(campaign) {
  const filter = { userId: campaign.userId };

  if (campaign.leads.length > 0) {
    filter._id = { $in: campaign.leads };
  }

  return Lead.find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
}

export async function findCampaignsForUser(userId) {
  ensureDatabaseConnection();

  return Campaign.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function createCampaignForUser(userId, campaignData) {
  ensureDatabaseConnection();

  const campaign = await Campaign.create({
    ...normalizeCampaignData(campaignData),
    userId,
  });

  return campaign.toObject();
}

export async function updateCampaignForUser(userId, campaignId, campaignData) {
  ensureDatabaseConnection();

  const update = normalizeCampaignData(campaignData, { partial: true });

  if (Object.keys(update).length === 0) {
    throw new AppError("No campaign fields provided for update", 400);
  }

  const campaign = await Campaign.findOneAndUpdate({ _id: campaignId, userId }, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  return campaign;
}

export async function startCampaignForUser(userId, campaignId) {
  ensureDatabaseConnection();

  const campaign = await getCampaignForUser(userId, campaignId);

  if (!["draft", "paused"].includes(campaign.status)) {
    throw new AppError("Only draft or paused campaigns can be started", 409);
  }

  const leads = await getCampaignLeads(campaign);
  const deliverableLeads = leads.filter((lead) => lead.email);

  if (deliverableLeads.length === 0) {
    throw new AppError("Campaign needs at least one lead with an email address", 400);
  }

  await assertEmailLimitForUser(userId, deliverableLeads.length);

  campaign.status = "running";
  await campaign.save();

  const delay = campaign.scheduledAt
    ? Math.max(0, campaign.scheduledAt.getTime() - Date.now())
    : 0;

  await enqueueJob(
    QUEUE_NAMES.EMAIL_CAMPAIGN,
    { campaignId: campaign._id.toString(), userId },
    { delay, name: "send-email-campaign" },
  );

  return campaign.toObject();
}

export async function processEmailCampaignJob({ campaignId, userId }, queueJob) {
  const campaign = await getCampaignForUser(userId, campaignId);

  if (campaign.status !== "running") {
    return campaign.toObject();
  }

  try {
    const leads = (await getCampaignLeads(campaign)).filter((lead) => lead.email);
    await assertEmailLimitForUser(userId, leads.length);

    for (const [index, lead] of leads.entries()) {
      const subject = renderTemplate(campaign.subject, lead);
      const body = renderTemplate(campaign.template, lead);
      const trackedEmail = await OutreachEmail.create({
        body,
        campaignId: campaign._id,
        leadId: lead._id,
        status: "queued",
        subject,
        to: lead.email,
        userId,
      });

      try {
        const result = await sendOutboundEmail({
          html: toBasicHtml(body),
          subject,
          text: body,
          to: lead.email,
        });

        trackedEmail.errorMessage = result.skipped ? "SMTP email is not configured" : "";
        trackedEmail.sentAt = result.skipped ? null : new Date();
        trackedEmail.status = result.skipped ? "skipped" : "sent";
        await trackedEmail.save();

        if (trackedEmail.status === "sent") {
          await createLeadActivity({
            description: `Campaign email sent: ${campaign.title}.`,
            leadId: lead._id,
            type: "email_sent",
            userId,
          });
        }
      } catch (error) {
        trackedEmail.errorMessage = error.message || "Campaign email failed";
        trackedEmail.status = "failed";
        await trackedEmail.save();
      }

      await queueJob?.updateProgress?.(Math.round(((index + 1) / leads.length) * 100));
    }

    campaign.status = "completed";
    await campaign.save();

    await Notification.create({
      actionUrl: "/messages",
      entityId: campaign._id,
      entityType: "campaign",
      eventType: "campaign_update",
      message: `${campaign.title} finished sending to ${leads.length} lead${leads.length === 1 ? "" : "s"}.`,
      title: "Campaign completed",
      type: "campaign",
      userId,
    });
  } catch (error) {
    campaign.status = "paused";
    await campaign.save();

    logWarning("Email campaign job failed", {
      campaignId,
      message: error.message,
      userId,
    });

    throw error;
  }

  return campaign.toObject();
}

export function registerCampaignQueue() {
  registerQueueProcessor(QUEUE_NAMES.EMAIL_CAMPAIGN, processEmailCampaignJob);
}
