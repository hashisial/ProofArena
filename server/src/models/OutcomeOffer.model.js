import mongoose from "mongoose";
import {
  OFFER_AVAILABILITY_STATUS,
  OFFER_AVAILABILITY_STATUS_VALUES,
  OFFER_DELIVERY_TYPE,
  OFFER_DELIVERY_TYPE_VALUES,
  OFFER_PRICE_TYPE,
  OFFER_PRICE_TYPE_VALUES,
  OUTCOME_OFFER_STATUS,
  OUTCOME_OFFER_STATUS_VALUES,
  OUTCOME_OFFER_VISIBILITY,
  OUTCOME_OFFER_VISIBILITY_VALUES,
  PROOF_TYPE_VALUES,
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

const targetOutcomeSchema = new mongoose.Schema(
  {
    metricName: {
      maxlength: 120,
      required: true,
      trim: true,
      type: String,
    },
    outcomeStatement: {
      maxlength: 500,
      required: true,
      trim: true,
      type: String,
    },
    targetValue: {
      maxlength: 120,
      required: true,
      trim: true,
      type: String,
    },
    unit: {
      default: "",
      maxlength: 50,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const successCriteriaSchema = new mongoose.Schema(
  {
    description: {
      default: "",
      maxlength: 500,
      trim: true,
      type: String,
    },
    required: {
      default: true,
      type: Boolean,
    },
    title: {
      maxlength: 120,
      required: true,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const proofIncludedSchema = new mongoose.Schema(
  {
    description: {
      default: "",
      maxlength: 500,
      trim: true,
      type: String,
    },
    proofType: {
      enum: PROOF_TYPE_VALUES,
      required: true,
      type: String,
    },
    required: {
      default: true,
      type: Boolean,
    },
    title: {
      maxlength: 120,
      required: true,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const deliveryTimelineSchema = new mongoose.Schema(
  {
    customLabel: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
    days: {
      max: 365,
      min: 1,
      type: Number,
    },
    maxDays: {
      max: 365,
      min: 1,
      type: Number,
      validate: {
        message: "Maximum delivery days must be greater than or equal to minimum delivery days",
        validator(value) {
          return value === undefined || this.minDays === undefined || value >= this.minDays;
        },
      },
    },
    minDays: {
      max: 365,
      min: 1,
      type: Number,
    },
    type: {
      enum: OFFER_DELIVERY_TYPE_VALUES,
      type: String,
    },
  },
  { _id: false },
);

const priceRangeSchema = new mongoose.Schema(
  {
    currency: {
      default: "USD",
      maxlength: 10,
      trim: true,
      uppercase: true,
      type: String,
    },
    customLabel: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
    max: {
      min: 0,
      type: Number,
      validate: {
        message: "Maximum price must be greater than or equal to minimum price",
        validator(value) {
          return value === undefined || this.min === undefined || value >= this.min;
        },
      },
    },
    min: {
      min: 0,
      type: Number,
    },
    type: {
      enum: OFFER_PRICE_TYPE_VALUES,
      type: String,
    },
  },
  { _id: false },
);

const milestoneTemplateSchema = new mongoose.Schema(
  {
    description: {
      default: "",
      maxlength: 500,
      trim: true,
      type: String,
    },
    expectedDueDay: {
      max: 365,
      min: 1,
      type: Number,
    },
    order: {
      default: 0,
      type: Number,
    },
    proofRequired: {
      default: false,
      type: Boolean,
    },
    title: {
      maxlength: 120,
      required: true,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const availabilitySchema = new mongoose.Schema(
  {
    capacityPerMonth: {
      max: 50,
      min: 0,
      type: Number,
    },
    note: {
      default: "",
      maxlength: 300,
      trim: true,
      type: String,
    },
    status: {
      default: OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW,
      enum: OFFER_AVAILABILITY_STATUS_VALUES,
      type: String,
    },
  },
  { _id: false },
);

const qualityScoreSchema = new mongoose.Schema(
  {
    lastCalculatedAt: {
      default: null,
      type: Date,
    },
    missingFields: {
      default: [],
      type: [String],
    },
    score: {
      default: 0,
      max: 100,
      min: 0,
      type: Number,
    },
  },
  { _id: false },
);

const statsSchema = new mongoose.Schema(
  {
    applicationsGenerated: { default: 0, min: 0, type: Number },
    invites: { default: 0, min: 0, type: Number },
    matchedChallenges: { default: 0, min: 0, type: Number },
    saves: { default: 0, min: 0, type: Number },
    views: { default: 0, min: 0, type: Number },
  },
  { _id: false },
);

const moderationSchema = new mongoose.Schema(
  {
    reason: {
      default: "",
      maxlength: 1000,
      trim: true,
      type: String,
    },
    reviewedAt: {
      default: null,
      type: Date,
    },
    reviewedBy: {
      default: null,
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      default: "approved",
      enum: ["pending", "approved", "rejected", "flagged"],
      type: String,
    },
  },
  { _id: false },
);

const aiMetadataSchema = new mongoose.Schema(
  {
    aiVersion: {
      default: "",
      trim: true,
      type: String,
    },
    generatedByAI: {
      default: false,
      type: Boolean,
    },
    lastAIImprovedAt: {
      default: null,
      type: Date,
    },
  },
  { _id: false },
);

const outcomeOfferSchema = new mongoose.Schema(
  {
    aiMetadata: {
      default: () => ({}),
      type: aiMetadataSchema,
    },
    availability: {
      default: () => ({ status: OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW }),
      type: availabilitySchema,
    },
    category: {
      index: true,
      maxlength: 80,
      required: true,
      trim: true,
      type: String,
    },
    deliveryTimeline: {
      default: () => ({ type: OFFER_DELIVERY_TYPE.CUSTOM }),
      type: deliveryTimelineSchema,
    },
    description: {
      maxlength: 3000,
      required: true,
      trim: true,
      type: String,
    },
    industries: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 80),
      type: [String],
    },
    milestoneTemplate: {
      default: [],
      type: [milestoneTemplateSchema],
      validate: {
        message: "Milestone template can include at most 20 milestones",
        validator(value) {
          return value.length <= 20;
        },
      },
    },
    moderation: {
      default: () => ({ status: "approved" }),
      type: moderationSchema,
    },
    priceRange: {
      default: () => ({ currency: "USD", type: OFFER_PRICE_TYPE.HIDDEN }),
      type: priceRangeSchema,
    },
    proofIncluded: {
      required: true,
      type: [proofIncludedSchema],
      validate: {
        message: "At least one proof item is required",
        validator(value) {
          return value.length >= 1 && value.length <= 20;
        },
      },
    },
    providerId: {
      index: true,
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    providerProfileId: {
      default: null,
      index: true,
      ref: "ProviderProfile",
      type: mongoose.Schema.Types.ObjectId,
    },
    qualityScore: {
      default: () => ({}),
      type: qualityScoreSchema,
    },
    shortSummary: {
      maxlength: 280,
      required: true,
      trim: true,
      type: String,
    },
    skills: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    slug: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
    },
    stats: {
      default: () => ({}),
      type: statsSchema,
    },
    status: {
      default: OUTCOME_OFFER_STATUS.DRAFT,
      enum: OUTCOME_OFFER_STATUS_VALUES,
      index: true,
      type: String,
    },
    subCategory: {
      default: "",
      maxlength: 80,
      trim: true,
      type: String,
    },
    successCriteria: {
      required: true,
      type: [successCriteriaSchema],
      validate: {
        message: "At least one success criterion is required",
        validator(value) {
          return value.length >= 1 && value.length <= 20;
        },
      },
    },
    tags: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 50),
      type: [String],
    },
    targetClient: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
    targetOutcome: {
      required: true,
      type: targetOutcomeSchema,
    },
    title: {
      maxlength: 140,
      minlength: 8,
      required: true,
      trim: true,
      type: String,
    },
    tools: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    visibility: {
      default: OUTCOME_OFFER_VISIBILITY.PUBLIC,
      enum: OUTCOME_OFFER_VISIBILITY_VALUES,
      index: true,
      type: String,
    },
  },
  baseSchemaOptions,
);

outcomeOfferSchema.index({ providerId: 1, slug: 1 }, { unique: true });
outcomeOfferSchema.index({ category: 1, status: 1, visibility: 1, createdAt: -1 });
outcomeOfferSchema.index({ "moderation.status": 1, status: 1, visibility: 1 });
outcomeOfferSchema.index({ createdAt: -1 });
outcomeOfferSchema.index(
  {
    description: "text",
    skills: "text",
    tags: "text",
    "targetOutcome.outcomeStatement": "text",
    title: "text",
  },
  {
    name: "outcome_offer_search_text",
    weights: {
      title: 10,
      "targetOutcome.outcomeStatement": 8,
      skills: 6,
      tags: 5,
      description: 2,
    },
  },
);

export const OutcomeOffer =
  mongoose.models.OutcomeOffer ||
  mongoose.model("OutcomeOffer", outcomeOfferSchema);

export default OutcomeOffer;
