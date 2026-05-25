import { EmailTemplate } from "../models/EmailTemplate.js";
import { Lead } from "../models/Lead.js";
import { OutreachEmail } from "../models/OutreachEmail.js";
import { OutreachJob } from "../models/OutreachJob.js";
import { QUEUE_NAMES } from "../constants/queueNames.js";
import { AppError } from "../utils/AppError.js";
import { logWarning } from "../utils/logger.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { sendOutboundEmail, toBasicHtml } from "./emailService.js";
import { createLeadActivity } from "./leadActivityService.js";
import { enqueueJob, registerQueueProcessor } from "./queueService.js";
import { assertEmailLimitForUser } from "./subscriptionService.js";

const validStatuses = new Set(["new", "contacted", "qualified", "closed", "lost", "all"]);
const defaultTemplates = [
  {
    body: "Hi {{name}},\n\nI noticed {{company}} and wanted to see if improving lead flow is a priority right now.\n\nWe help teams build systems for leads, automation, and growth. Would it make sense to connect for 15 minutes this week?\n\nBest,\nScaleOps",
    name: "Initial Outreach",
    subject: "Quick idea for {{company}}",
  },
  {
    body: "Hi {{name}},\n\nJust following up in case this got buried. If {{company}} is exploring better growth systems, I can share a few practical options.\n\nOpen to a quick call?\n\nBest,\nScaleOps",
    name: "Follow Up",
    subject: "Following up",
  },
];

function normalizeTemplateData(templateData = {}, { partial = false } = {}) {
  const template = {};

  ["name", "subject", "body"].forEach((field) => {
    if (templateData[field] !== undefined) {
      template[field] = String(templateData[field] ?? "").trim();
    }
  });

  if (!partial || template.name !== undefined) {
    if (!template.name) {
      throw new AppError("Template name is required", 400);
    }
  }

  if (!partial || template.subject !== undefined) {
    if (!template.subject) {
      throw new AppError("Template subject is required", 400);
    }
  }

  if (!partial || template.body !== undefined) {
    if (!template.body) {
      throw new AppError("Template body is required", 400);
    }
  }

  return template;
}

function renderTemplate(content, lead) {
  const replacements = {
    company: lead.company || "your team",
    email: lead.email || "",
    name: lead.name || "there",
    phone: lead.phone || "",
    service: lead.service || "",
    status: lead.status || "",
    website: lead.website || "",
  };

  return String(content ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return replacements[key] ?? "";
  });
}

async function ensureDefaultTemplates(userId) {
  const count = await EmailTemplate.countDocuments({ userId });

  if (count > 0) {
    return;
  }

  await EmailTemplate.insertMany(
    defaultTemplates.map((template) => ({
      ...template,
      userId,
    })),
  );
}

async function findTemplateForUser(userId, templateId) {
  const template = await EmailTemplate.findOne({ _id: templateId, userId }).lean();

  if (!template) {
    throw new AppError("Email template not found", 404);
  }

  return template;
}

async function findLeadForOutreach(userId, leadId) {
  const lead = await Lead.findOne({ _id: leadId, userId }).lean();

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
}

async function createTrackedEmail({ errorMessage = "", jobId, lead, rendered, status, template, userId }) {
  const email = await OutreachEmail.create({
    body: rendered.body,
    errorMessage,
    jobId: jobId ?? null,
    leadId: lead._id,
    sentAt: status === "sent" ? new Date() : null,
    status,
    subject: rendered.subject,
    templateId: template?._id ?? null,
    to: lead.email || "missing-email",
    userId,
  });

  return email.toObject();
}

async function createQueuedEmail({ jobId, lead, template, userId }) {
  const rendered = {
    body: renderTemplate(template.body, lead),
    subject: renderTemplate(template.subject, lead),
  };

  if (!lead.email) {
    return createTrackedEmail({
      errorMessage: "Lead has no email address",
      jobId,
      lead,
      rendered,
      status: "skipped",
      template,
      userId,
    });
  }

  return createTrackedEmail({
    jobId,
    lead,
    rendered,
    status: "queued",
    template,
    userId,
  });
}

export async function processOutreachEmail({ emailId }) {
  const email = await OutreachEmail.findById(emailId);

  if (!email || email.status !== "queued") {
    return email?.toObject() ?? null;
  }

  try {
    const result = await sendOutboundEmail({
      html: toBasicHtml(email.body),
      subject: email.subject,
      text: email.body,
      to: email.to,
    });

    email.errorMessage = result.skipped ? "SMTP email is not configured" : "";
    email.sentAt = result.skipped ? null : new Date();
    email.status = result.skipped ? "skipped" : "sent";
    await email.save();

    if (email.status === "sent") {
      await createLeadActivity({
        description: `Email sent: ${email.subject}.`,
        leadId: email.leadId,
        type: "email_sent",
        userId: email.userId,
      });
    }
  } catch (error) {
    email.errorMessage = error.message || "Email failed";
    email.status = "failed";
    await email.save();
  }

  return email.toObject();
}

export async function findEmailTemplates(userId) {
  ensureDatabaseConnection();

  await ensureDefaultTemplates(userId);

  return EmailTemplate.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function createEmailTemplate(userId, templateData) {
  ensureDatabaseConnection();

  return EmailTemplate.create({
    ...normalizeTemplateData(templateData),
    userId,
  });
}

export async function updateEmailTemplate(userId, templateId, templateData) {
  ensureDatabaseConnection();

  const update = normalizeTemplateData(templateData, { partial: true });

  if (Object.keys(update).length === 0) {
    throw new AppError("No template fields provided for update", 400);
  }

  const template = await EmailTemplate.findOneAndUpdate(
    { _id: templateId, userId },
    update,
    { new: true, runValidators: true },
  ).lean();

  if (!template) {
    throw new AppError("Email template not found", 404);
  }

  return template;
}

export async function deleteEmailTemplate(userId, templateId) {
  ensureDatabaseConnection();

  const template = await EmailTemplate.findOneAndDelete({ _id: templateId, userId }).lean();

  if (!template) {
    throw new AppError("Email template not found", 404);
  }

  return template;
}

export async function sendTemplateToLead(userId, { leadId, templateId }) {
  ensureDatabaseConnection();

  const [lead, template] = await Promise.all([
    findLeadForOutreach(userId, leadId),
    findTemplateForUser(userId, templateId),
  ]);

  await assertEmailLimitForUser(userId, 1);

  const email = await createQueuedEmail({ lead, template, userId });

  if (email.status === "queued") {
    await enqueueJob(
      QUEUE_NAMES.OUTREACH_EMAIL,
      { emailId: email._id.toString() },
      { name: "send-outreach-email" },
    );
  }

  return email;
}

export async function findOutreachEmails(userId) {
  ensureDatabaseConnection();

  return OutreachEmail.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("leadId", "name company email status")
    .populate("templateId", "name")
    .lean();
}

export async function findOutreachJobs(userId) {
  ensureDatabaseConnection();

  return OutreachJob.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("templateId", "name")
    .lean();
}

export async function processOutreachJob({ jobId }) {
  const job = await OutreachJob.findById(jobId);

  if (!job || job.status !== "queued") {
    return;
  }

  job.status = "running";
  job.startedAt = new Date();
  await job.save();

  try {
    const template = await findTemplateForUser(job.userId, job.templateId);
    const leadFilter = { userId: job.userId };

    if (job.statusFilter !== "all") {
      leadFilter.status = job.statusFilter;
    }

    const leads = await Lead.find(leadFilter).sort({ createdAt: -1 }).limit(100).lean();
    await assertEmailLimitForUser(job.userId, leads.filter((lead) => lead.email).length);
    const results = [];

    for (const lead of leads) {
      const email = await createQueuedEmail({
        jobId: job._id,
        lead,
        template,
        userId: job.userId,
      });

      results.push(
        email.status === "queued"
          ? await processOutreachEmail({ emailId: email._id.toString() })
          : email,
      );
    }

    job.targetCount = leads.length;
    job.sentCount = results.filter((email) => email.status === "sent").length;
    job.skippedCount = results.filter((email) => email.status === "skipped").length;
    job.failedCount = results.filter((email) => email.status === "failed").length;
    job.status = "completed";
    job.completedAt = new Date();
    await job.save();
  } catch (error) {
    job.status = "failed";
    job.errorMessage = error.message || "Outreach automation failed";
    job.completedAt = new Date();
    await job.save();

    logWarning("Outreach automation job failed", {
      jobId: job._id.toString(),
      message: error.message,
    });
  }
}

export async function createOutreachAutomationJob(userId, { statusFilter = "new", templateId }) {
  ensureDatabaseConnection();

  if (!validStatuses.has(statusFilter)) {
    throw new AppError("Status filter is invalid", 400);
  }

  await findTemplateForUser(userId, templateId);

  const job = await OutreachJob.create({
    statusFilter,
    templateId,
    userId,
  });

  await enqueueJob(
    QUEUE_NAMES.OUTREACH_AUTOMATION,
    { jobId: job._id.toString() },
    { name: "process-outreach-automation" },
  );

  return job.toObject();
}

export function registerOutreachQueues() {
  registerQueueProcessor(QUEUE_NAMES.OUTREACH_EMAIL, processOutreachEmail);
  registerQueueProcessor(QUEUE_NAMES.OUTREACH_AUTOMATION, processOutreachJob);
}
