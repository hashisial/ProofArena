import { API_BASE_URL } from "../../services/apiClient.js";

export const PROOF_ASSET_TYPE_OPTIONS = Object.freeze([
  { label: "Screenshot", value: "screenshot" },
  { label: "Document", value: "document" },
  { label: "PDF Report", value: "pdf_report" },
  { label: "CRM Export", value: "crm_export" },
  { label: "Analytics Report", value: "analytics_report" },
  { label: "Live URL", value: "live_url" },
  { label: "GitHub Link", value: "github_link" },
  { label: "Video Walkthrough", value: "video_walkthrough" },
  { label: "Case Study", value: "case_study" },
  { label: "Certificate", value: "certificate" },
  { label: "Portfolio Sample", value: "portfolio_sample" },
  { label: "Work Log", value: "work_log" },
  { label: "Other", value: "other" },
]);

export const PROOF_SOURCE_TYPE_OPTIONS = Object.freeze([
  { label: "File", value: "file" },
  { label: "Link", value: "link" },
  { label: "Text", value: "text" },
]);

export const PROOF_VISIBILITY_OPTIONS = Object.freeze([
  { label: "Private", value: "private" },
  { label: "Public", value: "public" },
  { label: "Unlisted", value: "unlisted" },
]);

export const PROOF_VERIFICATION_OPTIONS = Object.freeze([
  { label: "All statuses", value: "all" },
  { label: "Unverified", value: "unverified" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
  { label: "Flagged", value: "flagged" },
]);

export const PROOF_SORT_OPTIONS = Object.freeze([
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Title", value: "title" },
  { label: "Type", value: "type" },
  { label: "Verified first", value: "verified" },
]);

export const PROOF_ASSET_TYPE_LABELS = Object.freeze(
  Object.fromEntries(PROOF_ASSET_TYPE_OPTIONS.map((option) => [option.value, option.label])),
);

export const PROOF_SOURCE_TYPE_LABELS = Object.freeze(
  Object.fromEntries(PROOF_SOURCE_TYPE_OPTIONS.map((option) => [option.value, option.label])),
);

export const PROOF_VISIBILITY_LABELS = Object.freeze(
  Object.fromEntries(PROOF_VISIBILITY_OPTIONS.map((option) => [option.value, option.label])),
);

export const PROOF_VERIFICATION_LABELS = Object.freeze(
  Object.fromEntries(PROOF_VERIFICATION_OPTIONS.filter((option) => option.value !== "all").map((option) => [option.value, option.label])),
);

export const initialProofAssetForm = Object.freeze({
  assetType: "screenshot",
  category: "",
  description: "",
  link: {
    label: "",
    url: "",
  },
  relatedIndustriesText: "",
  relatedSkillsText: "",
  relatedToolsText: "",
  sourceType: "link",
  tagsText: "",
  textProof: {
    content: "",
  },
  title: "",
  visibility: "private",
});

export function createInitialProofAssetForm() {
  return JSON.parse(JSON.stringify(initialProofAssetForm));
}

export function buildProofAssetEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getProofAssetApiErrorMessage(error, fallback = "Proof asset action failed. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).filter(Boolean).join(" ");
  }

  return error?.message || fallback;
}

export function cleanString(value) {
  return String(value ?? "").trim();
}

export function parseListText(value, maxItems = 30) {
  return Array.from(
    new Set(
      cleanString(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, maxItems);
}

function cleanObject(value = {}) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""),
  );
}

export function proofAssetToForm(asset = {}) {
  return {
    assetType: asset.assetType ?? initialProofAssetForm.assetType,
    category: asset.category ?? "",
    description: asset.description ?? "",
    link: {
      label: asset.link?.label ?? "",
      url: asset.link?.url ?? "",
    },
    relatedIndustriesText: (asset.relatedIndustries ?? []).join(", "),
    relatedSkillsText: (asset.relatedSkills ?? []).join(", "),
    relatedToolsText: (asset.relatedTools ?? []).join(", "),
    sourceType: asset.sourceType ?? initialProofAssetForm.sourceType,
    tagsText: (asset.tags ?? []).join(", "),
    textProof: {
      content: asset.textProof?.content ?? "",
    },
    title: asset.title ?? "",
    visibility: asset.visibility ?? initialProofAssetForm.visibility,
  };
}

export function buildProofAssetPayload(form = {}) {
  const payload = {
    assetType: form.assetType,
    category: cleanString(form.category),
    description: cleanString(form.description),
    relatedIndustries: parseListText(form.relatedIndustriesText, 20),
    relatedSkills: parseListText(form.relatedSkillsText, 30),
    relatedTools: parseListText(form.relatedToolsText, 30),
    sourceType: form.sourceType,
    tags: parseListText(form.tagsText, 20),
    title: cleanString(form.title),
    visibility: form.visibility,
  };

  if (form.sourceType === "link") {
    payload.link = cleanObject({
      label: cleanString(form.link?.label),
      url: cleanString(form.link?.url),
    });
  }

  if (form.sourceType === "text") {
    payload.textProof = cleanObject({
      content: cleanString(form.textProof?.content),
    });
  }

  return payload;
}

export function validateProofAssetForm(form = {}) {
  const errors = {};

  if (cleanString(form.title).length < 3) errors.title = "Use at least 3 characters.";
  if (!form.assetType) errors.assetType = "Choose an asset type.";
  if (!form.sourceType) errors.sourceType = "Choose a source type.";

  if (form.sourceType === "link") {
    const url = cleanString(form.link?.url);
    if (!url) {
      errors.linkUrl = "Add a proof link URL.";
    } else {
      try {
        new URL(url);
      } catch {
        errors.linkUrl = "Use a valid URL.";
      }
    }
  }

  if (form.sourceType === "text" && !cleanString(form.textProof?.content)) {
    errors.textContent = "Add text proof content.";
  }

  if (form.sourceType === "file") {
    errors.file = "File upload is not connected yet. Use link or text proof for now.";
  }

  return errors;
}
