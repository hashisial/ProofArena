import { API_BASE_URL } from "../../services/apiClient.js";

export const CHALLENGE_STATUS_LABELS = Object.freeze({
  archived: "Archived",
  cancelled: "Cancelled",
  completed: "Completed",
  draft: "Draft",
  in_progress: "In Progress",
  open: "Open",
  paused: "Paused",
  proof_review: "Proof Review",
  provider_selected: "Provider Selected",
  reviewing_plans: "Reviewing Plans",
});

export const CHALLENGE_VISIBILITY_LABELS = Object.freeze({
  invite_only: "Invite Only",
  private: "Private",
  public: "Public",
  unlisted: "Unlisted",
});

export const CHALLENGE_CATEGORY_OPTIONS = Object.freeze([
  { label: "Lead Generation", value: "Lead Generation" },
  { label: "CRM Automation", value: "CRM Automation" },
  { label: "SaaS Delivery", value: "SaaS Delivery" },
  { label: "Website Development", value: "Website Development" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Virtual Assistant Workflow", value: "Virtual Assistant Workflow" },
  { label: "Marketing Execution", value: "Marketing Execution" },
  { label: "Proof-Based Consulting", value: "Proof-Based Consulting" },
]);

export const CHALLENGE_PROOF_TYPE_OPTIONS = Object.freeze([
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
  { label: "Before / After", value: "before_after" },
  { label: "Client Confirmation", value: "client_confirmation" },
  { label: "Other", value: "other" },
]);

export const CHALLENGE_TIMELINE_OPTIONS = Object.freeze([
  { label: "Fixed deadline", value: "fixed_deadline" },
  { label: "Duration days", value: "duration_days" },
  { label: "Range days", value: "range_days" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Custom", value: "custom" },
]);

export const CHALLENGE_BUDGET_OPTIONS = Object.freeze([
  { label: "Fixed", value: "fixed" },
  { label: "Range", value: "range" },
  { label: "Milestone", value: "milestone" },
  { label: "Hourly", value: "hourly" },
  { label: "Hidden", value: "hidden" },
  { label: "Negotiable", value: "negotiable" },
]);

export const CHALLENGE_CURRENCY_OPTIONS = Object.freeze([
  { label: "USD", value: "USD" },
  { label: "PKR", value: "PKR" },
  { label: "GBP", value: "GBP" },
  { label: "EUR", value: "EUR" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
]);

export const CHALLENGE_URGENCY_OPTIONS = Object.freeze([
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
]);

export const CHALLENGE_HIRING_URGENCY_OPTIONS = Object.freeze([
  { label: "Exploring", value: "exploring" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "Flexible", value: "flexible" },
]);

export const CHALLENGE_VISIBILITY_OPTIONS = Object.freeze([
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Invite only", value: "invite_only" },
  { label: "Unlisted", value: "unlisted" },
]);

export const initialChallengeForm = Object.freeze({
  budget: {
    currency: "USD",
    customLabel: "",
    max: "",
    min: "",
    type: "range",
  },
  category: "CRM Automation",
  clientIntent: {
    budgetConfirmed: false,
    decisionMakerConfirmed: false,
    hiringUrgency: "exploring",
    responseExpectation: "",
  },
  description: "",
  industriesText: "Real Estate, SaaS",
  industry: "",
  location: {
    city: "",
    country: "",
    remote: true,
    timezone: "",
  },
  milestoneTemplate: [
    {
      description: "Confirm access, source files, success criteria, and delivery cadence.",
      expectedDueDay: "2",
      proofRequired: false,
      title: "Setup and requirements confirmation",
    },
    {
      description: "Review the first cleaned batch and validate proof format.",
      expectedDueDay: "7",
      proofRequired: true,
      title: "First delivery checkpoint",
    },
    {
      description: "Submit final cleaned records, proof package, and summary report.",
      expectedDueDay: "30",
      proofRequired: true,
      title: "Final proof and report",
    },
  ],
  proofRequirements: [
    {
      description: "Weekly activity and completion notes.",
      proofType: "work_log",
      required: true,
      title: "Work log",
    },
    {
      description: "Export showing cleaned records and status tags.",
      proofType: "crm_export",
      required: true,
      title: "CRM export",
    },
  ],
  shortSummary: "",
  skillsNeededText: "CRM, Data Cleaning, Lead Verification",
  subCategory: "",
  successCriteria: [
    {
      description: "Define what must be true for this challenge to count as successful.",
      required: true,
      title: "Completion requirements",
    },
  ],
  tagsText: "crm cleanup, lead verification, weekly proof",
  targetOutcome: {
    metricName: "",
    outcomeStatement: "",
    targetValue: "",
    unit: "",
  },
  targetProviderType: "",
  timeline: {
    customLabel: "",
    durationDays: "",
    endDate: "",
    maxDays: "",
    minDays: "",
    startDate: "",
    type: "weekly",
  },
  title: "",
  toolsNeededText: "HubSpot, Google Sheets, Airtable",
  urgency: "normal",
  visibility: "public",
});

export function createInitialChallengeForm() {
  return JSON.parse(JSON.stringify(initialChallengeForm));
}

export function buildChallengeEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getChallengeApiErrorMessage(error, fallback = "Challenge could not be saved. Please try again.") {
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

function cleanDate(value) {
  return cleanString(value) || undefined;
}

export function formToChallengePayload(form) {
  return cleanObject({
    budget: cleanObject({
      currency: cleanString(form.budget.currency || "USD").toUpperCase(),
      customLabel: cleanString(form.budget.customLabel),
      max: cleanNumber(form.budget.max),
      min: cleanNumber(form.budget.min),
      type: form.budget.type,
    }),
    category: cleanString(form.category),
    clientIntent: cleanObject({
      budgetConfirmed: Boolean(form.clientIntent.budgetConfirmed),
      decisionMakerConfirmed: Boolean(form.clientIntent.decisionMakerConfirmed),
      hiringUrgency: form.clientIntent.hiringUrgency,
      responseExpectation: cleanString(form.clientIntent.responseExpectation),
    }),
    description: cleanString(form.description),
    industries: splitList(form.industriesText).slice(0, 20),
    industry: cleanString(form.industry),
    location: cleanObject({
      city: cleanString(form.location.city),
      country: cleanString(form.location.country),
      remote: Boolean(form.location.remote),
      timezone: cleanString(form.location.timezone),
    }),
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
    proofRequirements: form.proofRequirements
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
    skillsNeeded: splitList(form.skillsNeededText).slice(0, 30),
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
    targetOutcome: cleanObject({
      metricName: cleanString(form.targetOutcome.metricName),
      outcomeStatement: cleanString(form.targetOutcome.outcomeStatement),
      targetValue: cleanString(form.targetOutcome.targetValue),
      unit: cleanString(form.targetOutcome.unit),
    }),
    targetProviderType: cleanString(form.targetProviderType),
    timeline: cleanObject({
      customLabel: cleanString(form.timeline.customLabel),
      durationDays: cleanNumber(form.timeline.durationDays),
      endDate: cleanDate(form.timeline.endDate),
      maxDays: cleanNumber(form.timeline.maxDays),
      minDays: cleanNumber(form.timeline.minDays),
      startDate: cleanDate(form.timeline.startDate),
      type: form.timeline.type,
    }),
    title: cleanString(form.title),
    toolsNeeded: splitList(form.toolsNeededText).slice(0, 30),
    urgency: form.urgency,
    visibility: form.visibility,
  });
}

export function challengeToForm(challenge) {
  if (!challenge) {
    return createInitialChallengeForm();
  }

  return {
    ...initialChallengeForm,
    budget: {
      ...initialChallengeForm.budget,
      ...(challenge.budget ?? {}),
      max: challenge.budget?.max ?? "",
      min: challenge.budget?.min ?? "",
    },
    category: challenge.category || initialChallengeForm.category,
    clientIntent: {
      ...initialChallengeForm.clientIntent,
      ...(challenge.clientIntent ?? {}),
    },
    description: challenge.description ?? "",
    industriesText: listToText(challenge.industries),
    industry: challenge.industry ?? "",
    location: {
      ...initialChallengeForm.location,
      ...(challenge.location ?? {}),
    },
    milestoneTemplate: Array.isArray(challenge.milestoneTemplate) && challenge.milestoneTemplate.length > 0
      ? challenge.milestoneTemplate.map((item) => ({
          description: item.description ?? "",
          expectedDueDay: item.expectedDueDay ?? "",
          proofRequired: Boolean(item.proofRequired),
          title: item.title ?? "",
        }))
      : initialChallengeForm.milestoneTemplate,
    proofRequirements: Array.isArray(challenge.proofRequirements) && challenge.proofRequirements.length > 0
      ? challenge.proofRequirements.map((item) => ({
          description: item.description ?? "",
          proofType: item.proofType ?? "other",
          required: item.required !== false,
          title: item.title ?? "",
        }))
      : initialChallengeForm.proofRequirements,
    shortSummary: challenge.shortSummary ?? "",
    skillsNeededText: listToText(challenge.skillsNeeded),
    subCategory: challenge.subCategory ?? "",
    successCriteria: Array.isArray(challenge.successCriteria) && challenge.successCriteria.length > 0
      ? challenge.successCriteria.map((item) => ({
          description: item.description ?? "",
          required: item.required !== false,
          title: item.title ?? "",
        }))
      : initialChallengeForm.successCriteria,
    tagsText: listToText(challenge.tags),
    targetOutcome: {
      ...initialChallengeForm.targetOutcome,
      ...(challenge.targetOutcome ?? {}),
    },
    targetProviderType: challenge.targetProviderType ?? "",
    timeline: {
      ...initialChallengeForm.timeline,
      ...(challenge.timeline ?? {}),
      durationDays: challenge.timeline?.durationDays ?? "",
      endDate: challenge.timeline?.endDate ? String(challenge.timeline.endDate).slice(0, 10) : "",
      maxDays: challenge.timeline?.maxDays ?? "",
      minDays: challenge.timeline?.minDays ?? "",
      startDate: challenge.timeline?.startDate ? String(challenge.timeline.startDate).slice(0, 10) : "",
    },
    title: challenge.title ?? "",
    toolsNeededText: listToText(challenge.toolsNeeded),
    urgency: challenge.urgency ?? "normal",
    visibility: challenge.visibility ?? "public",
  };
}

export function calculateChallengeQuality(formOrChallenge) {
  const form = formOrChallenge?.targetOutcome ? formOrChallenge : challengeToForm(formOrChallenge);
  const hasTimeline =
    form.timeline?.type === "fixed_deadline"
      ? Boolean(form.timeline.endDate)
      : form.timeline?.type === "duration_days"
        ? Boolean(form.timeline.durationDays)
        : form.timeline?.type === "range_days"
          ? Boolean(form.timeline.minDays && form.timeline.maxDays)
          : form.timeline?.type === "custom"
            ? Boolean(form.timeline.customLabel)
            : Boolean(form.timeline?.type);
  const hasBudget =
    form.budget?.type === "hidden"
      ? false
      : form.budget?.type === "negotiable"
        ? true
        : form.budget?.type === "range"
          ? Boolean(form.budget.min && form.budget.max)
          : Boolean(form.budget?.min || form.budget?.max);
  const checks = [
    ["Clear title", cleanString(form.title).length >= 8],
    ["Category selected", Boolean(cleanString(form.category))],
    ["Target outcome added", Boolean(cleanString(form.targetOutcome?.outcomeStatement))],
    ["Success criteria added", form.successCriteria?.some((item) => cleanString(item.title))],
    ["Proof requirements added", form.proofRequirements?.some((item) => cleanString(item.title))],
    ["Timeline added", hasTimeline],
    ["Budget added", hasBudget],
    ["Skills/tools added", splitList(form.skillsNeededText).length > 0 && splitList(form.toolsNeededText).length > 0],
    ["Milestones added", form.milestoneTemplate?.some((item) => cleanString(item.title))],
    ["Client intent set", Boolean(form.clientIntent?.hiringUrgency)],
  ];
  const missingFields = checks.filter(([, passed]) => !passed).map(([label]) => label);
  const warnings = [];

  if (!form.clientIntent?.budgetConfirmed) warnings.push("Confirm the budget before inviting providers.");
  if (!form.clientIntent?.decisionMakerConfirmed) warnings.push("Confirm who will approve the work.");

  return {
    missingFields,
    score: Math.round(((checks.length - missingFields.length) / checks.length) * 100),
    warnings,
  };
}

export function getChallengeQualityLabel(score = 0) {
  if (score >= 90) return "Strong outcome challenge";
  if (score >= 70) return "Provider-ready challenge";
  if (score >= 40) return "Needs more clarity";
  return "Weak challenge";
}

export function formatChallengeTimeline(timeline = {}) {
  if (timeline.type === "fixed_deadline" && timeline.endDate) {
    return `By ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(timeline.endDate))}`;
  }

  if (timeline.type === "duration_days" && timeline.durationDays) {
    return `${timeline.durationDays} day${Number(timeline.durationDays) === 1 ? "" : "s"}`;
  }

  if (timeline.type === "range_days" && timeline.minDays && timeline.maxDays) {
    return `${timeline.minDays}-${timeline.maxDays} days`;
  }

  if (timeline.type === "weekly") return "Weekly";
  if (timeline.type === "monthly") return "Monthly";
  if (timeline.type === "ongoing") return "Ongoing";
  return timeline.customLabel || "Timeline scoped";
}

export function formatChallengeBudget(budget = {}) {
  const currency = budget.currency || "USD";
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 0,
      style: "currency",
    }).format(Number(amount));

  if (budget.type === "hidden") return "Budget hidden";
  if (budget.type === "negotiable") return "Negotiable";
  if (budget.type === "custom") return budget.customLabel || "Custom budget";
  if (budget.type === "range" && budget.min !== undefined && budget.max !== undefined) {
    return `${formatAmount(budget.min)}-${formatAmount(budget.max)}`;
  }
  if (budget.min !== undefined && budget.min !== "") return formatAmount(budget.min);
  return budget.customLabel || "Budget scoped";
}

export function validateChallengeForm(form, { requirePublishFields = false } = {}) {
  const errors = {};
  const budgetMin = Number(form.budget.min);
  const budgetMax = Number(form.budget.max);
  const minDays = Number(form.timeline.minDays);
  const maxDays = Number(form.timeline.maxDays);

  if (cleanString(form.title).length < 8) errors.title = "Use at least 8 characters.";
  if (!cleanString(form.shortSummary)) errors.shortSummary = "Add a short summary.";
  if (!cleanString(form.description)) errors.description = "Add a description.";
  if (!cleanString(form.category)) errors.category = "Choose a category.";
  if (!cleanString(form.targetOutcome.metricName)) errors.metricName = "Add the metric name.";
  if (!cleanString(form.targetOutcome.targetValue)) errors.targetValue = "Add the target value.";
  if (!cleanString(form.targetOutcome.outcomeStatement)) errors.outcomeStatement = "Add the outcome statement.";
  if (!form.successCriteria.some((item) => cleanString(item.title))) errors.successCriteria = "Add at least one success criterion.";
  if (!form.proofRequirements.some((item) => cleanString(item.title))) errors.proofRequirements = "Add at least one proof requirement.";
  if (form.budget.min !== "" && budgetMin < 0) errors.budgetMin = "Budget cannot be negative.";
  if (form.budget.max !== "" && budgetMax < 0) errors.budgetMax = "Budget cannot be negative.";
  if (form.budget.type === "range" && form.budget.min !== "" && form.budget.max !== "" && budgetMax < budgetMin) {
    errors.budgetMax = "Range maximum must be greater than or equal to minimum.";
  }
  if (
    form.timeline.type === "range_days" &&
    form.timeline.minDays !== "" &&
    form.timeline.maxDays !== "" &&
    maxDays < minDays
  ) {
    errors.maxDays = "Maximum days must be greater than or equal to minimum days.";
  }
  if (form.timeline.startDate && form.timeline.endDate && new Date(form.timeline.endDate) < new Date(form.timeline.startDate)) {
    errors.endDate = "End date must be after start date.";
  }

  if (requirePublishFields) {
    if (cleanString(form.description).length < 160) errors.description = "Use at least 160 characters before publishing.";
    if (calculateChallengeQuality(form).score < 70) errors.quality = "Improve challenge quality before publishing.";
  }

  return errors;
}
