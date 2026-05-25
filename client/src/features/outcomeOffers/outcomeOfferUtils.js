import { API_BASE_URL } from "../../services/apiClient.js";

export const OFFER_STATUS_LABELS = Object.freeze({
  archived: "Archived",
  draft: "Draft",
  paused: "Paused",
  published: "Published",
});

export const OFFER_VISIBILITY_LABELS = Object.freeze({
  private: "Private",
  public: "Public",
  unlisted: "Unlisted",
});

export const PROOF_TYPE_OPTIONS = Object.freeze([
  { label: "Screenshot", value: "screenshot" },
  { label: "Document", value: "document" },
  { label: "Live URL", value: "live_url" },
  { label: "CRM Export", value: "crm_export" },
  { label: "Analytics Report", value: "analytics_report" },
  { label: "Video Walkthrough", value: "video_walkthrough" },
  { label: "Git Commit", value: "git_commit" },
  { label: "Dashboard Access", value: "dashboard_access" },
  { label: "Confirmation Record", value: "confirmation_record" },
  { label: "Work Log", value: "work_log" },
  { label: "Other", value: "other" },
]);

export const DELIVERY_TYPE_OPTIONS = Object.freeze([
  { label: "Fixed days", value: "fixed_days" },
  { label: "Range days", value: "range_days" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Custom", value: "custom" },
]);

export const PRICE_TYPE_OPTIONS = Object.freeze([
  { label: "Fixed", value: "fixed" },
  { label: "Starting at", value: "starting_at" },
  { label: "Range", value: "range" },
  { label: "Custom", value: "custom" },
  { label: "Hidden", value: "hidden" },
]);

export const CURRENCY_OPTIONS = Object.freeze([
  { label: "USD", value: "USD" },
  { label: "PKR", value: "PKR" },
  { label: "GBP", value: "GBP" },
  { label: "EUR", value: "EUR" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
]);

export const AVAILABILITY_OPTIONS = Object.freeze([
  { label: "Available now", value: "available_now" },
  { label: "Available this week", value: "available_this_week" },
  { label: "Available next week", value: "available_next_week" },
  { label: "Limited", value: "limited" },
  { label: "Fully booked", value: "fully_booked" },
  { label: "Paused", value: "paused" },
]);

export const VISIBILITY_OPTIONS = Object.freeze([
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Unlisted", value: "unlisted" },
]);

export const CATEGORY_OPTIONS = Object.freeze([
  { label: "Lead Generation", value: "Lead Generation" },
  { label: "CRM Automation", value: "CRM Automation" },
  { label: "SaaS Delivery", value: "SaaS Delivery" },
  { label: "Website Development", value: "Website Development" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Virtual Assistant Workflow", value: "Virtual Assistant Workflow" },
  { label: "Marketing Execution", value: "Marketing Execution" },
  { label: "Proof-Based Consulting", value: "Proof-Based Consulting" },
]);

export const initialOutcomeOfferForm = Object.freeze({
  availability: {
    capacityPerMonth: "",
    note: "",
    status: "available_now",
  },
  category: "Lead Generation",
  deliveryTimeline: {
    customLabel: "",
    days: "30",
    maxDays: "",
    minDays: "",
    type: "fixed_days",
  },
  description: "",
  industriesText: "Real Estate",
  milestoneTemplate: [
    {
      description: "Confirm targeting, tools, access, and success criteria.",
      expectedDueDay: "2",
      proofRequired: false,
      title: "Setup and requirements",
    },
    {
      description: "Share early delivery progress and adjust execution if needed.",
      expectedDueDay: "14",
      proofRequired: true,
      title: "First delivery checkpoint",
    },
    {
      description: "Submit final proof package and outcome report.",
      expectedDueDay: "30",
      proofRequired: true,
      title: "Final proof and report",
    },
  ],
  priceRange: {
    currency: "USD",
    customLabel: "",
    max: "",
    min: "",
    type: "starting_at",
  },
  proofIncluded: [
    {
      description: "Export or sheet showing delivered work and qualification details.",
      proofType: "crm_export",
      required: true,
      title: "CRM sheet",
    },
    {
      description: "Weekly summary with status, blockers, and next actions.",
      proofType: "work_log",
      required: true,
      title: "Weekly report",
    },
  ],
  shortSummary: "",
  skillsText: "Lead Generation, CRM, Data Cleaning",
  subCategory: "",
  successCriteria: [
    {
      description: "Define what must be true for this outcome to count as completed.",
      required: true,
      title: "Qualified result requirements",
    },
  ],
  tagsText: "lead generation, seller leads, proof-based delivery",
  targetClient: "",
  targetOutcome: {
    metricName: "",
    outcomeStatement: "",
    targetValue: "",
    unit: "",
  },
  title: "",
  toolsText: "HubSpot, Google Sheets, Airtable",
  visibility: "public",
});

export function createInitialOutcomeOfferForm() {
  return JSON.parse(JSON.stringify(initialOutcomeOfferForm));
}

export function buildOutcomeOfferEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getApiErrorMessage(error, fallback = "Offer could not be saved. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).filter(Boolean).join(" ");
  }

  return error?.message || fallback;
}

export function splitList(value) {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToText(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function cleanNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function cleanObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""),
  );
}

export function formToOutcomeOfferPayload(form) {
  return cleanObject({
    availability: cleanObject({
      capacityPerMonth: cleanNumber(form.availability.capacityPerMonth),
      note: cleanString(form.availability.note),
      status: form.availability.status,
    }),
    category: cleanString(form.category),
    deliveryTimeline: cleanObject({
      customLabel: cleanString(form.deliveryTimeline.customLabel),
      days: cleanNumber(form.deliveryTimeline.days),
      maxDays: cleanNumber(form.deliveryTimeline.maxDays),
      minDays: cleanNumber(form.deliveryTimeline.minDays),
      type: form.deliveryTimeline.type,
    }),
    description: cleanString(form.description),
    industries: splitList(form.industriesText).slice(0, 20),
    milestoneTemplate: form.milestoneTemplate
      .map((item, index) =>
        cleanObject({
          description: cleanString(item.description),
          expectedDueDay: cleanNumber(item.expectedDueDay),
          order: index,
          proofRequired: Boolean(item.proofRequired),
          title: cleanString(item.title),
        }),
      )
      .filter((item) => item.title),
    priceRange: cleanObject({
      currency: cleanString(form.priceRange.currency || "USD").toUpperCase(),
      customLabel: cleanString(form.priceRange.customLabel),
      max: cleanNumber(form.priceRange.max),
      min: cleanNumber(form.priceRange.min),
      type: form.priceRange.type,
    }),
    proofIncluded: form.proofIncluded
      .map((item) =>
        cleanObject({
          description: cleanString(item.description),
          proofType: item.proofType || "other",
          required: Boolean(item.required),
          title: cleanString(item.title),
        }),
      )
      .filter((item) => item.title),
    shortSummary: cleanString(form.shortSummary),
    skills: splitList(form.skillsText).slice(0, 30),
    subCategory: cleanString(form.subCategory),
    successCriteria: form.successCriteria
      .map((item) =>
        cleanObject({
          description: cleanString(item.description),
          required: Boolean(item.required),
          title: cleanString(item.title),
        }),
      )
      .filter((item) => item.title),
    tags: splitList(form.tagsText).slice(0, 20),
    targetClient: cleanString(form.targetClient),
    targetOutcome: cleanObject({
      metricName: cleanString(form.targetOutcome.metricName),
      outcomeStatement: cleanString(form.targetOutcome.outcomeStatement),
      targetValue: cleanString(form.targetOutcome.targetValue),
      unit: cleanString(form.targetOutcome.unit),
    }),
    title: cleanString(form.title),
    tools: splitList(form.toolsText).slice(0, 30),
    visibility: form.visibility,
  });
}

export function outcomeOfferToForm(offer) {
  if (!offer) {
    return createInitialOutcomeOfferForm();
  }

  return {
    ...initialOutcomeOfferForm,
    availability: {
      ...initialOutcomeOfferForm.availability,
      ...(offer.availability ?? {}),
      capacityPerMonth: offer.availability?.capacityPerMonth ?? "",
    },
    category: offer.category || initialOutcomeOfferForm.category,
    deliveryTimeline: {
      ...initialOutcomeOfferForm.deliveryTimeline,
      ...(offer.deliveryTimeline ?? {}),
      days: offer.deliveryTimeline?.days ?? "",
      maxDays: offer.deliveryTimeline?.maxDays ?? "",
      minDays: offer.deliveryTimeline?.minDays ?? "",
    },
    description: offer.description ?? "",
    industriesText: listToText(offer.industries),
    milestoneTemplate: Array.isArray(offer.milestoneTemplate) && offer.milestoneTemplate.length > 0
      ? offer.milestoneTemplate.map((item) => ({
          description: item.description ?? "",
          expectedDueDay: item.expectedDueDay ?? "",
          proofRequired: Boolean(item.proofRequired),
          title: item.title ?? "",
        }))
      : initialOutcomeOfferForm.milestoneTemplate,
    priceRange: {
      ...initialOutcomeOfferForm.priceRange,
      ...(offer.priceRange ?? {}),
      max: offer.priceRange?.max ?? "",
      min: offer.priceRange?.min ?? "",
    },
    proofIncluded: Array.isArray(offer.proofIncluded) && offer.proofIncluded.length > 0
      ? offer.proofIncluded.map((item) => ({
          description: item.description ?? "",
          proofType: item.proofType ?? "other",
          required: item.required !== false,
          title: item.title ?? "",
        }))
      : initialOutcomeOfferForm.proofIncluded,
    shortSummary: offer.shortSummary ?? "",
    skillsText: listToText(offer.skills),
    subCategory: offer.subCategory ?? "",
    successCriteria: Array.isArray(offer.successCriteria) && offer.successCriteria.length > 0
      ? offer.successCriteria.map((item) => ({
          description: item.description ?? "",
          required: item.required !== false,
          title: item.title ?? "",
        }))
      : initialOutcomeOfferForm.successCriteria,
    tagsText: listToText(offer.tags),
    targetClient: offer.targetClient ?? "",
    targetOutcome: {
      ...initialOutcomeOfferForm.targetOutcome,
      ...(offer.targetOutcome ?? {}),
    },
    title: offer.title ?? "",
    toolsText: listToText(offer.tools),
    visibility: offer.visibility ?? "public",
  };
}

export function calculateOutcomeOfferQuality(formOrOffer) {
  const form = formOrOffer?.targetOutcome ? formOrOffer : outcomeOfferToForm(formOrOffer);
  const hasTimeline =
    form.deliveryTimeline?.type === "fixed_days"
      ? Boolean(form.deliveryTimeline.days)
      : form.deliveryTimeline?.type === "range_days"
        ? Boolean(form.deliveryTimeline.minDays && form.deliveryTimeline.maxDays)
        : form.deliveryTimeline?.type === "custom"
          ? Boolean(form.deliveryTimeline.customLabel)
          : Boolean(form.deliveryTimeline?.type);
  const hasPrice =
    form.priceRange?.type === "hidden"
      ? false
      : form.priceRange?.type === "custom"
        ? Boolean(form.priceRange.customLabel)
        : Boolean(form.priceRange?.min || form.priceRange?.max);
  const checks = [
    ["Clear title", cleanString(form.title).length >= 8],
    ["Target outcome added", Boolean(cleanString(form.targetOutcome?.outcomeStatement))],
    ["Success criteria added", form.successCriteria?.some((item) => cleanString(item.title))],
    ["Proof included", form.proofIncluded?.some((item) => cleanString(item.title))],
    ["Timeline added", hasTimeline],
    ["Price added", hasPrice],
    ["Skills/tools added", splitList(form.skillsText).length > 0 && splitList(form.toolsText).length > 0],
    ["Milestones added", form.milestoneTemplate?.some((item) => cleanString(item.title))],
    ["Availability set", Boolean(form.availability?.status)],
  ];
  const missingFields = checks.filter(([, passed]) => !passed).map(([label]) => label);

  return {
    missingFields,
    score: Math.round(((checks.length - missingFields.length) / checks.length) * 100),
  };
}

export function getQualityLabel(score = 0) {
  if (score >= 90) return "Client-ready offer";
  if (score >= 70) return "Strong offer";
  if (score >= 40) return "Needs more proof clarity";
  return "Weak offer";
}

export function formatTimeline(deliveryTimeline = {}) {
  if (deliveryTimeline.type === "fixed_days" && deliveryTimeline.days) {
    return `${deliveryTimeline.days} day${Number(deliveryTimeline.days) === 1 ? "" : "s"}`;
  }

  if (deliveryTimeline.type === "range_days" && deliveryTimeline.minDays && deliveryTimeline.maxDays) {
    return `${deliveryTimeline.minDays}-${deliveryTimeline.maxDays} days`;
  }

  if (deliveryTimeline.type === "weekly") {
    return "Weekly";
  }

  if (deliveryTimeline.type === "monthly") {
    return "Monthly";
  }

  return deliveryTimeline.customLabel || "Timeline scoped";
}

export function formatOfferPrice(priceRange = {}) {
  const currency = priceRange.currency || "USD";
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 0,
      style: "currency",
    }).format(Number(amount));

  if (priceRange.type === "hidden") {
    return "Price hidden";
  }

  if (priceRange.type === "custom") {
    return priceRange.customLabel || "Custom quote";
  }

  if (priceRange.type === "range" && priceRange.min !== undefined && priceRange.max !== undefined) {
    return `${formatAmount(priceRange.min)}-${formatAmount(priceRange.max)}`;
  }

  if (priceRange.min !== undefined && priceRange.min !== "") {
    return priceRange.type === "starting_at"
      ? `Starting at ${formatAmount(priceRange.min)}`
      : formatAmount(priceRange.min);
  }

  return "Price scoped";
}

export function validateOutcomeOfferForm(form, { requirePublishFields = false } = {}) {
  const errors = {};
  const priceMin = Number(form.priceRange.min);
  const priceMax = Number(form.priceRange.max);
  const minDays = Number(form.deliveryTimeline.minDays);
  const maxDays = Number(form.deliveryTimeline.maxDays);

  if (cleanString(form.title).length < 8) errors.title = "Use at least 8 characters.";
  if (!cleanString(form.shortSummary)) errors.shortSummary = "Add a short summary.";
  if (!cleanString(form.description)) errors.description = "Add a description.";
  if (!cleanString(form.category)) errors.category = "Choose a category.";
  if (!cleanString(form.targetOutcome.metricName)) errors.metricName = "Add the metric name.";
  if (!cleanString(form.targetOutcome.targetValue)) errors.targetValue = "Add the target value.";
  if (!cleanString(form.targetOutcome.outcomeStatement)) errors.outcomeStatement = "Add the outcome statement.";
  if (!form.successCriteria.some((item) => cleanString(item.title))) errors.successCriteria = "Add at least one success criterion.";
  if (!form.proofIncluded.some((item) => cleanString(item.title))) errors.proofIncluded = "Add at least one proof item.";
  if (form.priceRange.min !== "" && priceMin < 0) errors.priceMin = "Price cannot be negative.";
  if (form.priceRange.max !== "" && priceMax < 0) errors.priceMax = "Price cannot be negative.";
  if (form.priceRange.type === "range" && form.priceRange.min !== "" && form.priceRange.max !== "" && priceMax < priceMin) {
    errors.priceMax = "Range maximum must be greater than or equal to minimum.";
  }
  if (
    form.deliveryTimeline.type === "range_days" &&
    form.deliveryTimeline.minDays !== "" &&
    form.deliveryTimeline.maxDays !== "" &&
    maxDays < minDays
  ) {
    errors.maxDays = "Maximum days must be greater than or equal to minimum days.";
  }

  if (requirePublishFields) {
    if (cleanString(form.description).length < 120) errors.description = "Use at least 120 characters before publishing.";
    if (calculateOutcomeOfferQuality(form).score < 70) errors.quality = "Improve the offer quality before publishing.";
  }

  return errors;
}
