import mongoose from "mongoose";
import {
  AI_EXTRACTION_STATUS,
  AI_EXTRACTION_STATUS_VALUES,
  PROOF_ASSET_TYPE_VALUES,
  PROOF_ASSET_VISIBILITY,
  PROOF_ASSET_VISIBILITY_VALUES,
  PROOF_SOURCE_TYPE_VALUES,
  PROOF_VERIFICATION_STATUS,
  PROOF_VERIFICATION_STATUS_VALUES,
} from "../constants/index.js";
import { baseSchemaOptions } from "./base.model.js";

function normalizeStringList(values, maxItems, maxLength) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim().slice(0, maxLength))
        .filter(Boolean),
    ),
  ).slice(0, maxItems);
}

const fileSchema = new mongoose.Schema(
  {
    extension: { default: "", trim: true, type: String },
    filename: { default: "", trim: true, type: String },
    mimeType: { default: "", trim: true, type: String },
    originalName: { default: "", trim: true, type: String },
    publicId: { default: "", trim: true, type: String },
    sizeBytes: { default: 0, min: 0, type: Number },
    url: { default: "", trim: true, type: String },
  },
  { _id: false },
);

const linkSchema = new mongoose.Schema(
  {
    label: { default: "", maxlength: 120, trim: true, type: String },
    url: { default: "", trim: true, type: String },
  },
  { _id: false },
);

const textProofSchema = new mongoose.Schema(
  {
    content: { default: "", maxlength: 5000, trim: true, type: String },
  },
  { _id: false },
);

const linkedContextsSchema = new mongoose.Schema(
  {
    challengeIds: [{ ref: "Challenge", type: mongoose.Schema.Types.ObjectId }],
    executionPlanIds: [{ ref: "ExecutionPlan", type: mongoose.Schema.Types.ObjectId }],
    outcomeOfferIds: [{ ref: "OutcomeOffer", type: mongoose.Schema.Types.ObjectId }],
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    note: { default: "", maxlength: 1000, trim: true, type: String },
    rejectionReason: { default: "", maxlength: 1000, trim: true, type: String },
    reviewedAt: Date,
    reviewedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  },
  { _id: false },
);

const aiExtractionSchema = new mongoose.Schema(
  {
    confidence: { max: 100, min: 0, type: Number },
    detectedFields: {
      default: [],
      set: (values) => normalizeStringList(values, 50, 120),
      type: [String],
    },
    extractedText: { default: "", maxlength: 10000, trim: true, type: String },
    processedAt: Date,
    status: {
      default: AI_EXTRACTION_STATUS.NOT_STARTED,
      enum: AI_EXTRACTION_STATUS_VALUES,
      type: String,
    },
    summary: { default: "", maxlength: 2000, trim: true, type: String },
  },
  { _id: false },
);

const statsSchema = new mongoose.Schema(
  {
    attachedToOffers: { default: 0, min: 0, type: Number },
    attachedToPlans: { default: 0, min: 0, type: Number },
    usedInSubmissions: { default: 0, min: 0, type: Number },
    views: { default: 0, min: 0, type: Number },
  },
  { _id: false },
);

const proofAssetSchema = new mongoose.Schema(
  {
    aiExtraction: {
      default: () => ({}),
      type: aiExtractionSchema,
    },
    assetType: {
      enum: PROOF_ASSET_TYPE_VALUES,
      index: true,
      required: true,
      type: String,
    },
    category: {
      default: "",
      index: true,
      maxlength: 80,
      trim: true,
      type: String,
    },
    description: {
      default: "",
      maxlength: 1500,
      trim: true,
      type: String,
    },
    file: {
      default: () => ({}),
      type: fileSchema,
    },
    link: {
      default: () => ({}),
      type: linkSchema,
    },
    linkedContexts: {
      default: () => ({
        challengeIds: [],
        executionPlanIds: [],
        outcomeOfferIds: [],
      }),
      type: linkedContextsSchema,
    },
    providerId: {
      index: true,
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    providerProfileId: {
      index: true,
      ref: "ProviderProfile",
      type: mongoose.Schema.Types.ObjectId,
    },
    relatedIndustries: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 80),
      type: [String],
    },
    relatedSkills: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    relatedTools: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    review: {
      default: () => ({}),
      type: reviewSchema,
    },
    sourceType: {
      enum: PROOF_SOURCE_TYPE_VALUES,
      index: true,
      required: true,
      type: String,
    },
    stats: {
      default: () => ({}),
      type: statsSchema,
    },
    tags: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 50),
      type: [String],
    },
    textProof: {
      default: () => ({}),
      type: textProofSchema,
    },
    title: {
      maxlength: 140,
      minlength: 3,
      required: true,
      trim: true,
      type: String,
    },
    verificationStatus: {
      default: PROOF_VERIFICATION_STATUS.UNVERIFIED,
      enum: PROOF_VERIFICATION_STATUS_VALUES,
      index: true,
      type: String,
    },
    visibility: {
      default: PROOF_ASSET_VISIBILITY.PRIVATE,
      enum: PROOF_ASSET_VISIBILITY_VALUES,
      index: true,
      type: String,
    },
  },
  baseSchemaOptions,
);

proofAssetSchema.index({ providerId: 1, createdAt: -1 });
proofAssetSchema.index({ assetType: 1, createdAt: -1 });
proofAssetSchema.index({ sourceType: 1, createdAt: -1 });
proofAssetSchema.index({ category: 1, createdAt: -1 });
proofAssetSchema.index({ visibility: 1, createdAt: -1 });
proofAssetSchema.index({ verificationStatus: 1, createdAt: -1 });
proofAssetSchema.index({
  "aiExtraction.extractedText": "text",
  description: "text",
  relatedSkills: "text",
  relatedTools: "text",
  tags: "text",
  title: "text",
});

export const ProofAsset = mongoose.model("ProofAsset", proofAssetSchema);
