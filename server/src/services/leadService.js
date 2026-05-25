import { Lead } from "../models/Lead.js";
import { AppError } from "../utils/AppError.js";
import { getOptionalOwnerFilter } from "../utils/ownerScope.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { createLeadActivity } from "./leadActivityService.js";
import { assertLeadLimitForUser } from "./subscriptionService.js";

const leadStatuses = new Set(["new", "contacted", "qualified", "closed", "lost"]);
const legacyStatusMap = {
  converted: "closed",
  won: "closed",
};

function getSortDirection(sort = "desc") {
  return sort === "asc" ? 1 : -1;
}

function getLeadProjection() {
  return "userId fullName name email phone company industry website source sourceKeyword status tags notes service message createdAt updatedAt";
}

function normalizeStatus(status) {
  const normalizedStatus = String(status ?? "").trim().toLowerCase();

  return legacyStatusMap[normalizedStatus] ?? normalizedStatus;
}

function normalizeLeadRecord(lead) {
  if (!lead) {
    return lead;
  }

  return {
    ...lead,
    status: normalizeStatus(lead.status) || "new",
  };
}

function normalizeLeadData(leadData = {}, { partial = false } = {}) {
  const normalizedLead = {};

  [
    "company",
    "email",
    "fullName",
    "industry",
    "message",
    "name",
    "notes",
    "phone",
    "service",
    "sourceKeyword",
    "website",
  ].forEach((field) => {
    if (leadData[field] !== undefined) {
      normalizedLead[field] = String(leadData[field] ?? "").trim();
    }
  });

  if (!normalizedLead.fullName && normalizedLead.name) {
    normalizedLead.fullName = normalizedLead.name;
  }

  if (!normalizedLead.name && normalizedLead.fullName) {
    normalizedLead.name = normalizedLead.fullName;
  }

  if (normalizedLead.email) {
    normalizedLead.email = normalizedLead.email.toLowerCase();
  }

  if (leadData.tags !== undefined) {
    normalizedLead.tags = Array.isArray(leadData.tags)
      ? leadData.tags.map((tag) => String(tag ?? "").trim()).filter(Boolean)
      : String(leadData.tags ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
  }

  if (leadData.status !== undefined) {
    normalizedLead.status = normalizeStatus(leadData.status);
  }

  if (leadData.source !== undefined) {
    normalizedLead.source = String(leadData.source ?? "").trim();
  }

  if (!partial) {
    normalizedLead.status = normalizedLead.status || "new";
    normalizedLead.service = normalizedLead.service || "Manual Lead";
    normalizedLead.message = normalizedLead.message || "";
    normalizedLead.source = normalizedLead.source || "manual";
  }

  if (!partial || normalizedLead.fullName !== undefined || normalizedLead.name !== undefined) {
    if (!normalizedLead.fullName) {
      throw new AppError("Lead name is required", 400);
    }
  }

  if (!partial || normalizedLead.email !== undefined) {
    if (!normalizedLead.email) {
      throw new AppError("Lead email is required", 400);
    }
  }

  if (normalizedLead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedLead.email)) {
    throw new AppError("Lead email must be valid", 400);
  }

  if (normalizedLead.status && !leadStatuses.has(normalizedLead.status)) {
    throw new AppError("Lead status is invalid", 400);
  }

  return normalizedLead;
}

function normalizeScrapedLeadData(leadData = {}) {
  const normalizedLead = normalizeLeadData(
    {
      ...leadData,
      source: "scrape",
      status: "new",
    },
    { partial: true },
  );

  if (!normalizedLead.fullName) {
    throw new AppError("Scraped lead name is required", 400);
  }

  normalizedLead.email = normalizedLead.email ?? "";
  normalizedLead.service = normalizedLead.service || "Scraped Lead";
  normalizedLead.message = normalizedLead.message || "";
  normalizedLead.source = "scrape";
  normalizedLead.status = "new";

  return normalizedLead;
}

export async function findLeads({ sort = "desc", userId } = {}) {
  ensureDatabaseConnection();

  return Lead.find(getOptionalOwnerFilter(userId))
    .sort({ createdAt: getSortDirection(sort) })
    .select(getLeadProjection())
    .lean()
    .then((leads) => leads.map(normalizeLeadRecord));
}

export async function countLeads({ userId } = {}) {
  ensureDatabaseConnection();

  return Lead.countDocuments(getOptionalOwnerFilter(userId));
}

export async function findLeadById(id, { userId } = {}) {
  ensureDatabaseConnection();

  const lead = await Lead.findOne({
    _id: id,
    ...getOptionalOwnerFilter(userId),
  }).lean();

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return normalizeLeadRecord(lead);
}

export async function findLeadsForUser(userId, { sort = "desc" } = {}) {
  return findLeads({ sort, userId });
}

export async function findRecentLeadsForUser(userId, { limit = 5 } = {}) {
  ensureDatabaseConnection();

  return Lead.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select(getLeadProjection())
    .lean()
    .then((leads) => leads.map(normalizeLeadRecord));
}

export async function createLeadForUser(userId, leadData) {
  ensureDatabaseConnection();

  await assertLeadLimitForUser(userId, 1);

  const lead = await Lead.create({
    ...normalizeLeadData(leadData),
    userId,
  });

  await createLeadActivity({
    description: "Lead added manually.",
    leadId: lead._id,
    type: "imported",
    userId,
  });

  return lead;
}

export async function createScrapedLeadsForUser(userId, leads = []) {
  ensureDatabaseConnection();

  if (!Array.isArray(leads) || leads.length === 0) {
    return [];
  }

  await assertLeadLimitForUser(userId, leads.length);

  const normalizedLeads = leads.map((lead) => ({
    ...normalizeScrapedLeadData(lead),
    userId,
  }));

  const savedLeads = await Lead.insertMany(normalizedLeads, { ordered: false });

  await Promise.all(
    savedLeads.map((lead) =>
      createLeadActivity({
        description: "Lead imported from scraping job.",
        leadId: lead._id,
        type: "imported",
        userId,
      }),
    ),
  );

  return savedLeads;
}

export async function importLeadsForUser(userId, leads = []) {
  ensureDatabaseConnection();

  if (!Array.isArray(leads) || leads.length === 0) {
    throw new AppError("At least one lead is required for import", 400);
  }

  if (leads.length > 500) {
    throw new AppError("Import is limited to 500 leads at a time", 400);
  }

  await assertLeadLimitForUser(userId, leads.length);

  const normalizedLeads = leads.map((lead) => ({
    ...normalizeLeadData({
      ...lead,
      source: "csv_import",
    }),
    userId,
  }));

  const savedLeads = await Lead.insertMany(normalizedLeads, { ordered: false });

  await Promise.all(
    savedLeads.map((lead) =>
      createLeadActivity({
        description: "Lead imported from CSV.",
        leadId: lead._id,
        type: "imported",
        userId,
      }),
    ),
  );

  return savedLeads;
}

export async function updateLeadForUser(userId, leadId, leadData) {
  ensureDatabaseConnection();

  const update = normalizeLeadData(leadData, { partial: true });

  if (Object.keys(update).length === 0) {
    throw new AppError("No lead fields provided for update", 400);
  }

  const existingLead = await Lead.findOne({ _id: leadId, userId }).lean();

  if (!existingLead) {
    throw new AppError("Lead not found", 404);
  }

  const lead = await Lead.findOneAndUpdate({ _id: leadId, userId }, update, {
    new: true,
    runValidators: true,
  })
    .select(getLeadProjection())
    .lean();

  if (update.status && update.status !== existingLead.status) {
    await createLeadActivity({
      description: `Status changed from ${existingLead.status} to ${update.status}.`,
      leadId,
      type: "status_changed",
      userId,
    });
  }

  if (update.notes && update.notes !== existingLead.notes) {
    await createLeadActivity({
      description: "Note added or updated.",
      leadId,
      type: "note_added",
      userId,
    });
  }

  return normalizeLeadRecord(lead);
}

export async function deleteLeadForUser(userId, leadId) {
  ensureDatabaseConnection();

  const lead = await Lead.findOneAndDelete({ _id: leadId, userId }).lean();

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
}
