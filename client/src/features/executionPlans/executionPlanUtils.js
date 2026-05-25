import { API_BASE_URL } from "../../services/apiClient.js";

export const EXECUTION_PLAN_STATUS_LABELS = Object.freeze({
  accepted: "Accepted",
  draft: "Draft",
  expired: "Expired",
  rejected: "Rejected",
  shortlisted: "Shortlisted",
  submitted: "Submitted",
  withdrawn: "Withdrawn",
});

export const PLAN_TIMELINE_OPTIONS = Object.freeze([
  { label: "Fixed days", value: "fixed_days" },
  { label: "Range days", value: "range_days" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Custom", value: "custom" },
]);

export const PLAN_PRICE_OPTIONS = Object.freeze([
  { label: "Fixed", value: "fixed" },
  { label: "Range", value: "range" },
  { label: "Milestone", value: "milestone" },
  { label: "Hourly", value: "hourly" },
  { label: "Custom", value: "custom" },
]);

export const PLAN_CURRENCY_OPTIONS = Object.freeze([
  { label: "USD", value: "USD" },
  { label: "PKR", value: "PKR" },
  { label: "GBP", value: "GBP" },
  { label: "EUR", value: "EUR" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
]);

export const PLAN_PROOF_TYPE_OPTIONS = Object.freeze([
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

export const PLAN_UPDATE_FREQUENCY_OPTIONS = Object.freeze([
  { label: "Daily", value: "daily" },
  { label: "Every 2 days", value: "every_2_days" },
  { label: "Weekly", value: "weekly" },
  { label: "Milestone based", value: "milestone_based" },
  { label: "Custom", value: "custom" },
]);

export const PLAN_CAN_START_OPTIONS = Object.freeze([
  { label: "Immediately", value: "immediately" },
  { label: "This week", value: "this_week" },
  { label: "Next week", value: "next_week" },
  { label: "Custom", value: "custom" },
]);

export const PLAN_ATTACHMENT_TYPE_OPTIONS = Object.freeze([
  { label: "Portfolio", value: "portfolio" },
  { label: "Case study", value: "case_study" },
  { label: "Document", value: "document" },
  { label: "Live URL", value: "live_url" },
  { label: "GitHub", value: "github" },
  { label: "Proof asset", value: "proof_asset" },
  { label: "Other", value: "other" },
]);

export const initialExecutionPlanForm = Object.freeze({
  approach: "",
  attachments: [
    {
      note: "",
      title: "",
      type: "portfolio",
      url: "",
    },
  ],
  availability: {
    canStart: "this_week",
    customStartDate: "",
    hoursPerWeek: "",
    note: "",
  },
  communicationPlan: {
    channelsText: "Email, Dashboard updates",
    note: "",
    updateFrequency: "milestone_based",
  },
  milestones: [
    {
      deliverable: "Confirmed scope and working access.",
      description: "Review challenge requirements, confirm access, and align on proof format.",
      expectedDueDay: "2",
      proofPlanned: false,
      title: "Setup and requirements",
    },
    {
      deliverable: "First delivery batch with proof notes.",
      description: "Complete the first execution checkpoint and share early evidence for review.",
      expectedDueDay: "7",
      proofPlanned: true,
      title: "First delivery checkpoint",
    },
    {
      deliverable: "Final proof package and outcome summary.",
      description: "Deliver the final outcome with proof records, summary, and handoff notes.",
      expectedDueDay: "30",
      proofPlanned: true,
      title: "Final proof and report",
    },
  ],
  outcomeOfferId: "",
  price: {
    currency: "USD",
    customLabel: "",
    max: "",
    min: "",
    type: "range",
  },
  proofPlan: [
    {
      description: "Proof record showing the completed work and reviewable evidence.",
      proofType: "work_log",
      relatedMilestoneOrder: "1",
      required: true,
      title: "Work log",
    },
    {
      description: "Export or document that verifies the delivered outcome.",
      proofType: "document",
      relatedMilestoneOrder: "2",
      required: true,
      title: "Final proof record",
    },
  ],
  riskHandling: [
    {
      mitigation: "I will confirm data quality and access before starting execution.",
      risk: "Missing access or unclear source data",
    },
  ],
  skillsText: "CRM, Data Cleaning, Operations",
  summary: "",
  timeline: {
    customLabel: "",
    days: "",
    maxDays: "",
    minDays: "",
    type: "range_days",
  },
  title: "",
  toolsText: "Google Sheets, HubSpot, Airtable",
  whyThisProvider: "",
});

export function createInitialExecutionPlanForm() {
  return JSON.parse(JSON.stringify(initialExecutionPlanForm));
}

export function buildExecutionPlanEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getExecutionPlanApiErrorMessage(error, fallback = "Execution plan could not be saved. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).filter(Boolean).join(" ");
  }

  if (/already submitted/i.test(error?.message ?? "")) {
    return "You already submitted a plan for this challenge.";
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

export function formToExecutionPlanPayload(form, { challengeId, includeChallenge = false } = {}) {
  return cleanObject({
    ...(includeChallenge ? { challengeId: cleanString(challengeId) } : {}),
    approach: cleanString(form.approach),
    attachments: form.attachments
      .map((item) =>
        cleanObject({
          note: cleanString(item.note),
          title: cleanString(item.title),
          type: item.type || "other",
          url: cleanString(item.url),
        }),
      )
      .filter((item) => item.title || item.url),
    availability: cleanObject({
      canStart: form.availability.canStart,
      customStartDate: cleanDate(form.availability.customStartDate),
      hoursPerWeek: cleanNumber(form.availability.hoursPerWeek),
      note: cleanString(form.availability.note),
    }),
    communicationPlan: cleanObject({
      channels: splitList(form.communicationPlan.channelsText).slice(0, 10),
      note: cleanString(form.communicationPlan.note),
      updateFrequency: form.communicationPlan.updateFrequency,
    }),
    milestones: form.milestones
      .map((item, index) =>
        cleanObject({
          deliverable: cleanString(item.deliverable),
          description: cleanString(item.description),
          expectedDueDay: cleanNumber(item.expectedDueDay),
          order: index,
          proofPlanned: Boolean(item.proofPlanned),
          title: cleanString(item.title),
        }),
      )
      .filter((item) => item.title),
    outcomeOfferId: includeChallenge && form.outcomeOfferId ? cleanString(form.outcomeOfferId) : undefined,
    price: cleanObject({
      currency: cleanString(form.price.currency || "USD").toUpperCase(),
      customLabel: cleanString(form.price.customLabel),
      max: cleanNumber(form.price.max),
      min: cleanNumber(form.price.min),
      type: form.price.type,
    }),
    proofPlan: form.proofPlan
      .map((item) =>
        cleanObject({
          description: cleanString(item.description),
          proofType: item.proofType || "other",
          relatedMilestoneOrder: cleanNumber(item.relatedMilestoneOrder),
          required: Boolean(item.required),
          title: cleanString(item.title),
        }),
      )
      .filter((item) => item.title),
    riskHandling: form.riskHandling
      .map((item) =>
        cleanObject({
          mitigation: cleanString(item.mitigation),
          risk: cleanString(item.risk),
        }),
      )
      .filter((item) => item.risk && item.mitigation),
    skills: splitList(form.skillsText).slice(0, 30),
    summary: cleanString(form.summary),
    timeline: cleanObject({
      customLabel: cleanString(form.timeline.customLabel),
      days: cleanNumber(form.timeline.days),
      maxDays: cleanNumber(form.timeline.maxDays),
      minDays: cleanNumber(form.timeline.minDays),
      type: form.timeline.type,
    }),
    title: cleanString(form.title),
    tools: splitList(form.toolsText).slice(0, 30),
    whyThisProvider: cleanString(form.whyThisProvider),
  });
}

export function executionPlanToForm(plan) {
  if (!plan) {
    return createInitialExecutionPlanForm();
  }

  return {
    ...initialExecutionPlanForm,
    approach: plan.approach ?? "",
    attachments: Array.isArray(plan.attachments) && plan.attachments.length > 0
      ? plan.attachments.map((item) => ({
          note: item.note ?? "",
          title: item.title ?? "",
          type: item.type ?? "other",
          url: item.url ?? "",
        }))
      : initialExecutionPlanForm.attachments,
    availability: {
      ...initialExecutionPlanForm.availability,
      ...(plan.availability ?? {}),
      customStartDate: plan.availability?.customStartDate ? String(plan.availability.customStartDate).slice(0, 10) : "",
      hoursPerWeek: plan.availability?.hoursPerWeek ?? "",
    },
    communicationPlan: {
      ...initialExecutionPlanForm.communicationPlan,
      ...(plan.communicationPlan ?? {}),
      channelsText: listToText(plan.communicationPlan?.channels),
    },
    milestones: Array.isArray(plan.milestones) && plan.milestones.length > 0
      ? plan.milestones.map((item) => ({
          deliverable: item.deliverable ?? "",
          description: item.description ?? "",
          expectedDueDay: item.expectedDueDay ?? "",
          proofPlanned: Boolean(item.proofPlanned),
          title: item.title ?? "",
        }))
      : initialExecutionPlanForm.milestones,
    outcomeOfferId: plan.outcomeOfferId ?? "",
    price: {
      ...initialExecutionPlanForm.price,
      ...(plan.price ?? {}),
      max: plan.price?.max ?? "",
      min: plan.price?.min ?? "",
    },
    proofPlan: Array.isArray(plan.proofPlan) && plan.proofPlan.length > 0
      ? plan.proofPlan.map((item) => ({
          description: item.description ?? "",
          proofType: item.proofType ?? "other",
          relatedMilestoneOrder: item.relatedMilestoneOrder ?? "",
          required: item.required !== false,
          title: item.title ?? "",
        }))
      : initialExecutionPlanForm.proofPlan,
    riskHandling: Array.isArray(plan.riskHandling) && plan.riskHandling.length > 0
      ? plan.riskHandling.map((item) => ({
          mitigation: item.mitigation ?? "",
          risk: item.risk ?? "",
        }))
      : initialExecutionPlanForm.riskHandling,
    skillsText: listToText(plan.skills),
    summary: plan.summary ?? "",
    timeline: {
      ...initialExecutionPlanForm.timeline,
      ...(plan.timeline ?? {}),
      days: plan.timeline?.days ?? "",
      maxDays: plan.timeline?.maxDays ?? "",
      minDays: plan.timeline?.minDays ?? "",
    },
    title: plan.title ?? "",
    toolsText: listToText(plan.tools),
    whyThisProvider: plan.whyThisProvider ?? "",
  };
}

export function calculateExecutionPlanQuality(formOrPlan) {
  if (formOrPlan?.planScore?.score !== undefined) {
    return formOrPlan.planScore;
  }

  const form = formOrPlan?.toolsText !== undefined ? formOrPlan : executionPlanToForm(formOrPlan);
  const hasTimeline =
    form.timeline?.type === "fixed_days"
      ? Boolean(form.timeline.days)
      : form.timeline?.type === "range_days"
        ? Boolean(form.timeline.minDays && form.timeline.maxDays)
        : form.timeline?.type === "custom"
          ? Boolean(form.timeline.customLabel)
          : Boolean(form.timeline?.type);
  const hasPrice =
    form.price?.type === "custom"
      ? Boolean(form.price.customLabel)
      : form.price?.type === "range"
        ? Boolean(form.price.min && form.price.max)
        : Boolean(form.price?.min || form.price?.max);
  const checks = [
    ["Clear title", cleanString(form.title).length >= 8],
    ["Strong summary", cleanString(form.summary).length >= 40],
    ["Detailed approach", cleanString(form.approach).length >= 120],
    ["Milestones added", form.milestones?.some((item) => cleanString(item.title))],
    ["Proof plan added", form.proofPlan?.some((item) => cleanString(item.title))],
    ["Timeline added", hasTimeline],
    ["Price added", hasPrice],
    ["Risk handling added", form.riskHandling?.some((item) => cleanString(item.risk) && cleanString(item.mitigation))],
    ["Communication plan added", Boolean(form.communicationPlan?.updateFrequency)],
    ["Tools or skills added", splitList(form.toolsText).length > 0 || splitList(form.skillsText).length > 0],
    ["Provider fit explained", cleanString(form.whyThisProvider).length >= 40],
    ["Relevant links attached", form.attachments?.some((item) => cleanString(item.title) || cleanString(item.url))],
  ];
  const strengths = checks.filter(([, passed]) => passed).map(([label]) => label);
  const missingFields = checks.filter(([, passed]) => !passed).map(([label]) => label);
  const warnings = [];

  if (cleanString(form.approach) && cleanString(form.approach).length < 120) {
    warnings.push("Add more detail to the approach.");
  }

  if (!form.proofPlan?.some((proof) => proof.required !== false)) {
    warnings.push("Mark at least one proof item as required.");
  }

  return {
    missingFields,
    score: Math.round(((checks.length - missingFields.length) / checks.length) * 100),
    strengths,
    warnings,
  };
}

export function getExecutionPlanQualityLabel(score = 0) {
  if (score >= 90) return "Client-ready plan";
  if (score >= 70) return "Strong execution plan";
  if (score >= 40) return "Needs more clarity";
  return "Weak plan";
}

export function formatPlanTimeline(timeline = {}) {
  if (timeline.type === "fixed_days" && timeline.days) {
    return `${timeline.days} day${Number(timeline.days) === 1 ? "" : "s"}`;
  }

  if (timeline.type === "range_days" && timeline.minDays && timeline.maxDays) {
    return `${timeline.minDays}-${timeline.maxDays} days`;
  }

  if (timeline.type === "weekly") return "Weekly";
  if (timeline.type === "monthly") return "Monthly";
  return timeline.customLabel || "Timeline scoped";
}

export function formatPlanPrice(price = {}) {
  const currency = price.currency || "USD";
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 0,
      style: "currency",
    }).format(Number(amount));

  if (price.type === "custom") return price.customLabel || "Custom pricing";
  if (price.type === "range" && price.min !== undefined && price.max !== undefined) {
    return `${formatAmount(price.min)}-${formatAmount(price.max)}`;
  }
  if (price.min !== undefined && price.min !== "") return formatAmount(price.min);
  return price.customLabel || "Price scoped";
}

export function canEditExecutionPlan(status) {
  return ["draft", "submitted"].includes(status);
}

export function canWithdrawExecutionPlan(status) {
  return ["draft", "submitted", "shortlisted", "rejected"].includes(status);
}

export function canDecideExecutionPlan(status) {
  return ["submitted", "shortlisted"].includes(status);
}

export function validateExecutionPlanForm(form, { challengeId } = {}) {
  const errors = {};
  const priceMin = Number(form.price.min);
  const priceMax = Number(form.price.max);
  const minDays = Number(form.timeline.minDays);
  const maxDays = Number(form.timeline.maxDays);

  if (!cleanString(challengeId)) errors.challengeId = "Choose a challenge before submitting.";
  if (cleanString(form.title).length < 8) errors.title = "Use at least 8 characters.";
  if (!cleanString(form.summary)) errors.summary = "Add a summary.";
  if (!cleanString(form.approach)) errors.approach = "Add an approach.";
  if (!form.timeline?.type) errors.timeline = "Choose a timeline.";
  if (!form.price?.type) errors.price = "Choose a price type.";
  if (!form.milestones.some((item) => cleanString(item.title))) errors.milestones = "Add at least one milestone.";
  if (!form.proofPlan.some((item) => cleanString(item.title))) errors.proofPlan = "Add at least one proof item.";
  if (form.price.min !== "" && priceMin < 0) errors.priceMin = "Price cannot be negative.";
  if (form.price.max !== "" && priceMax < 0) errors.priceMax = "Price cannot be negative.";
  if (form.price.type === "range" && form.price.min !== "" && form.price.max !== "" && priceMax < priceMin) {
    errors.priceMax = "Range maximum must be greater than or equal to minimum.";
  }
  if (
    form.timeline.type === "range_days" &&
    form.timeline.minDays !== "" &&
    form.timeline.maxDays !== "" &&
    maxDays < minDays
  ) {
    errors.maxDays = "Maximum days must be greater than or equal to minimum days.";
  }

  return errors;
}
