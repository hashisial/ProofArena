import { Lead } from "../models/Lead.js";
import { LeadScrapeJob } from "../models/LeadScrapeJob.js";
import { QUEUE_NAMES } from "../constants/queueNames.js";
import { AppError } from "../utils/AppError.js";
import { logWarning } from "../utils/logger.js";
import { createScrapedLeadsForUser } from "./leadService.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { enqueueJob, registerQueueProcessor } from "./queueService.js";
import { assertScrapeLimitForUser } from "./subscriptionService.js";

const maxScrapedLeads = 20;
const fetchTimeoutMs = 8000;

function normalizeKeyword(keyword) {
  return String(keyword ?? "").trim().replace(/\s+/g, " ");
}

function normalizeLocation(location) {
  return String(location ?? "").trim().replace(/\s+/g, " ");
}

function normalizeKey(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getLeadKey(lead) {
  const email = normalizeKey(lead.email);
  const website = normalizeKey(lead.website);

  if (email) {
    return `email:${email}`;
  }

  if (website) {
    return `website:${website}`;
  }

  return `name:${normalizeKey(lead.name)}|company:${normalizeKey(lead.company)}`;
}

function cleanLeadName(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/^[-\s]+|[-\s]+$/g, "")
    .slice(0, 120);
}

function getCompanyFromText(text) {
  const [firstSegment] = String(text ?? "").split(/[-|–:]/);
  return cleanLeadName(firstSegment);
}

function createAbortSignal() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);

  return {
    signal: controller.signal,
    stop: () => clearTimeout(timeout),
  };
}

async function fetchJson(url, headers = {}) {
  const abort = createAbortSignal();

  try {
    const response = await fetch(url, {
      headers,
      signal: abort.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return response.json();
  } finally {
    abort.stop();
  }
}

function flattenDuckDuckGoTopics(topics = []) {
  return topics.flatMap((topic) => {
    if (Array.isArray(topic.Topics)) {
      return flattenDuckDuckGoTopics(topic.Topics);
    }

    return topic.Text || topic.FirstURL ? [topic] : [];
  });
}

async function fetchDuckDuckGoLeads(keyword) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(keyword)}&format=json&no_html=1&skip_disambig=1`;
  const data = await fetchJson(url);
  const topics = flattenDuckDuckGoTopics(data.RelatedTopics).slice(0, 12);

  return topics
    .map((topic) => {
      const company = getCompanyFromText(topic.Text);

      if (!company) {
        return null;
      }

      return {
        company,
        message: `Scraped from DuckDuckGo result for "${keyword}". ${topic.Text ?? ""}`.trim(),
        name: company,
        service: "Scraped Lead",
        sourceKeyword: keyword,
        website: topic.FirstURL ?? "",
      };
    })
    .filter(Boolean);
}

async function fetchOpenStreetMapLeads(keyword) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&q=${encodeURIComponent(keyword)}`;
  const data = await fetchJson(url, {
    "Accept-Language": "en",
    "User-Agent": "ScaleOpsLeadScraper/1.0",
  });

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((place) => {
      const company = cleanLeadName(place.name || String(place.display_name ?? "").split(",")[0]);

      if (!company) {
        return null;
      }

      return {
        company,
        message: `Scraped from OpenStreetMap search for "${keyword}". Location: ${place.display_name ?? "Unknown"}`,
        name: company,
        service: "Scraped Lead",
        sourceKeyword: keyword,
      };
    })
    .filter(Boolean);
}

async function scrapeBasicLeads(keyword) {
  const sourceResults = await Promise.allSettled([
    fetchOpenStreetMapLeads(keyword),
    fetchDuckDuckGoLeads(keyword),
  ]);

  const leads = sourceResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
  const uniqueLeads = new Map();

  leads.forEach((lead) => {
    const key = getLeadKey(lead);

    if (!uniqueLeads.has(key)) {
      uniqueLeads.set(key, lead);
    }
  });

  return Array.from(uniqueLeads.values()).slice(0, maxScrapedLeads);
}

async function filterExistingLeads(userId, scrapedLeads) {
  if (scrapedLeads.length === 0) {
    return [];
  }

  const existingLeads = await Lead.find({ userId })
    .select("name email website company")
    .lean();
  const existingKeys = new Set(existingLeads.map(getLeadKey));

  return scrapedLeads.filter((lead) => !existingKeys.has(getLeadKey(lead)));
}

export async function processLeadScrapeJob({ jobId }, queueJob) {
  const job = await LeadScrapeJob.findById(jobId);

  if (!job || !["pending", "running"].includes(job.status)) {
    return;
  }

  job.status = "running";
  job.startedAt = new Date();
  await job.save();
  await queueJob?.updateProgress?.(15);

  try {
    const scrapeQuery = [job.keyword, job.location].filter(Boolean).join(" ");
    const scrapedLeads = await scrapeBasicLeads(scrapeQuery);
    await queueJob?.updateProgress?.(55);
    const newLeads = await filterExistingLeads(job.userId, scrapedLeads);
    const savedLeads = await createScrapedLeadsForUser(job.userId, newLeads);

    job.status = "completed";
    job.discoveredCount = scrapedLeads.length;
    job.savedCount = savedLeads.length;
    job.totalResults = savedLeads.length;
    job.leadIds = savedLeads.map((lead) => lead._id);
    job.completedAt = new Date();
    await job.save();
    await queueJob?.updateProgress?.(100);
  } catch (error) {
    job.status = "failed";
    job.errorMessage = error.message || "Lead scraping failed";
    job.completedAt = new Date();
    await job.save();

    logWarning("Lead scrape job failed", {
      jobId: job._id.toString(),
      message: error.message,
    });
  }
}

export async function createLeadScrapeJob(userId, keyword, location = "") {
  ensureDatabaseConnection();

  const normalizedKeyword = normalizeKeyword(keyword);
  const normalizedLocation = normalizeLocation(location);

  if (normalizedKeyword.length < 3) {
    throw new AppError("Keyword must be at least 3 characters", 400);
  }

  await assertScrapeLimitForUser(userId);

  const job = await LeadScrapeJob.create({
    keyword: normalizedKeyword,
    location: normalizedLocation,
    status: "pending",
    userId,
  });

  await enqueueJob(
    QUEUE_NAMES.LEAD_SCRAPE,
    { jobId: job._id.toString() },
    { name: "process-lead-scrape" },
  );

  return job.toObject();
}

export async function findLeadScrapeJobs(userId) {
  ensureDatabaseConnection();

  return LeadScrapeJob.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();
}

export async function findLeadScrapeJobById(userId, jobId) {
  ensureDatabaseConnection();

  const job = await LeadScrapeJob.findOne({ _id: jobId, userId }).lean();

  if (!job) {
    throw new AppError("Lead scrape job not found", 404);
  }

  return job;
}

export function registerLeadScrapeQueue() {
  registerQueueProcessor(QUEUE_NAMES.LEAD_SCRAPE, processLeadScrapeJob);
}
