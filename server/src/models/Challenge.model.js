import mongoose from "mongoose";
import {
  CHALLENGE_BUDGET_TYPE,
  CHALLENGE_TIMELINE_TYPE,
  CHALLENGE_TIMELINE_TYPE_VALUES,
  CHALLENGE_URGENCY,
  CHALLENGE_URGENCY_VALUES,
  CHALLENGE_VISIBILITY,
  CLIENT_CHALLENGE_BUDGET_TYPE_VALUES,
  CLIENT_CHALLENGE_STATUS_VALUES,
  CLIENT_CHALLENGE_VISIBILITY_VALUES,
  CHALLENGE_STATUS,
  PROOF_SIMPLICITY,
  PROOF_SIMPLICITY_VALUES,
  PROOF_TYPE_VALUES,
  STARTER_CHALLENGE_LEVEL,
  STARTER_CHALLENGE_LEVEL_VALUES,
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
      maxlength: 700,
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
      maxlength: 700,
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

const proofRequirementSchema = new mongoose.Schema(
  {
    description: {
      default: "",
      maxlength: 700,
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

const timelineSchema = new mongoose.Schema(
  {
    customLabel: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
    durationDays: {
      max: 365,
      min: 1,
      type: Number,
    },
    endDate: {
      type: Date,
      validate: {
        message: "Timeline end date must be after start date",
        validator(value) {
          return value === undefined || !this.startDate || value >= this.startDate;
        },
      },
    },
    maxDays: {
      max: 365,
      min: 1,
      type: Number,
      validate: {
        message: "Maximum timeline days must be greater than or equal to minimum timeline days",
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
    startDate: {
      type: Date,
    },
    type: {
      enum: CHALLENGE_TIMELINE_TYPE_VALUES,
      type: String,
    },
  },
  { _id: false },
);

const budgetSchema = new mongoose.Schema(
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
        message: "Maximum budget must be greater than or equal to minimum budget",
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
      enum: CLIENT_CHALLENGE_BUDGET_TYPE_VALUES,
      type: String,
    },
  },
  { _id: false },
);

const milestoneTemplateSchema = new mongoose.Schema(
  {
    description: {
      default: "",
      maxlength: 700,
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

const locationSchema = new mongoose.Schema(
  {
    city: {
      default: "",
      maxlength: 80,
      trim: true,
      type: String,
    },
    country: {
      default: "",
      maxlength: 80,
      trim: true,
      type: String,
    },
    remote: {
      default: true,
      type: Boolean,
    },
    timezone: {
      default: "",
      maxlength: 80,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const applicationStatsSchema = new mongoose.Schema(
  {
    invitedProviders: { default: 0, min: 0, type: Number },
    selectedProviderId: {
      default: null,
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    shortlistedPlans: { default: 0, min: 0, type: Number },
    totalPlans: { default: 0, min: 0, type: Number },
  },
  { _id: false },
);

const proofStatusSchema = new mongoose.Schema(
  {
    approvedProofs: { default: 0, min: 0, type: Number },
    rejectedProofs: { default: 0, min: 0, type: Number },
    requiredProofs: { default: 0, min: 0, type: Number },
    submittedProofs: { default: 0, min: 0, type: Number },
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
    warnings: {
      default: [],
      type: [String],
    },
  },
  { _id: false },
);

const clientIntentSchema = new mongoose.Schema(
  {
    budgetConfirmed: {
      default: false,
      type: Boolean,
    },
    decisionMakerConfirmed: {
      default: false,
      type: Boolean,
    },
    hiringUrgency: {
      default: "exploring",
      enum: ["exploring", "this_week", "this_month", "flexible"],
      type: String,
    },
    responseExpectation: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const statsSchema = new mongoose.Schema(
  {
    matchedProviders: { default: 0, min: 0, type: Number },
    saves: { default: 0, min: 0, type: Number },
    shares: { default: 0, min: 0, type: Number },
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

const starterChallengeSchema = new mongoose.Schema(
  {
    enabled: {
      default: false,
      type: Boolean,
    },
    estimatedHours: {
      max: 80,
      min: 1,
      type: Number,
    },
    level: {
      default: STARTER_CHALLENGE_LEVEL.STANDARD,
      enum: STARTER_CHALLENGE_LEVEL_VALUES,
      type: String,
    },
    newProviderFriendly: {
      default: false,
      type: Boolean,
    },
    proofSimplicity: {
      default: PROOF_SIMPLICITY.MODERATE,
      enum: PROOF_SIMPLICITY_VALUES,
      type: String,
    },
    providerLimit: {
      max: 50,
      min: 1,
      type: Number,
    },
    recommendedForFirstClient: {
      default: false,
      type: Boolean,
    },
  },
  { _id: false },
);

const challengeSchema = new mongoose.Schema(
  {
    aiMetadata: {
      default: () => ({}),
      type: aiMetadataSchema,
    },
    applicationStats: {
      default: () => ({}),
      type: applicationStatsSchema,
    },
    budget: {
      default: () => ({ currency: "USD", type: CHALLENGE_BUDGET_TYPE.HIDDEN }),
      type: budgetSchema,
    },
    category: {
      index: true,
      maxlength: 80,
      required: true,
      trim: true,
      type: String,
    },
    clientId: {
      index: true,
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    clientIntent: {
      default: () => ({}),
      type: clientIntentSchema,
    },
    clientProfileId: {
      default: null,
      index: true,
      ref: "UserProfile",
      type: mongoose.Schema.Types.ObjectId,
    },
    closedAt: {
      default: null,
      type: Date,
    },
    description: {
      maxlength: 5000,
      required: true,
      trim: true,
      type: String,
    },
    industries: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 80),
      type: [String],
    },
    industry: {
      default: "",
      maxlength: 80,
      trim: true,
      type: String,
    },
    location: {
      default: () => ({ remote: true }),
      type: locationSchema,
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
    proofRequirements: {
      required: true,
      type: [proofRequirementSchema],
      validate: {
        message: "At least one proof requirement is required",
        validator(value) {
          return value.length >= 1 && value.length <= 20;
        },
      },
    },
    proofStatus: {
      default: () => ({}),
      type: proofStatusSchema,
    },
    publishedAt: {
      default: null,
      index: true,
      type: Date,
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
    skillsNeeded: {
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
    starterChallenge: {
      default: () => ({}),
      type: starterChallengeSchema,
    },
    status: {
      default: CHALLENGE_STATUS.DRAFT,
      enum: CLIENT_CHALLENGE_STATUS_VALUES,
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
    targetOutcome: {
      required: true,
      type: targetOutcomeSchema,
    },
    targetProviderType: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
    timeline: {
      default: () => ({ type: CHALLENGE_TIMELINE_TYPE.CUSTOM }),
      type: timelineSchema,
    },
    title: {
      maxlength: 140,
      minlength: 8,
      required: true,
      trim: true,
      type: String,
    },
    toolsNeeded: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    urgency: {
      default: CHALLENGE_URGENCY.NORMAL,
      enum: CHALLENGE_URGENCY_VALUES,
      index: true,
      type: String,
    },
    visibility: {
      default: CHALLENGE_VISIBILITY.PUBLIC,
      enum: CLIENT_CHALLENGE_VISIBILITY_VALUES,
      index: true,
      type: String,
    },
  },
  baseSchemaOptions,
);

challengeSchema.index({ clientId: 1, slug: 1 }, { unique: true });
challengeSchema.index({ category: 1, status: 1, visibility: 1, publishedAt: -1 });
challengeSchema.index({ "moderation.status": 1, status: 1, visibility: 1 });
challengeSchema.index({
  "starterChallenge.enabled": 1,
  "starterChallenge.newProviderFriendly": 1,
  "starterChallenge.recommendedForFirstClient": 1,
  status: 1,
  visibility: 1,
  publishedAt: -1,
});
challengeSchema.index({ createdAt: -1 });
challengeSchema.index({ publishedAt: -1 });
challengeSchema.index(
  {
    description: "text",
    skillsNeeded: "text",
    tags: "text",
    "targetOutcome.outcomeStatement": "text",
    title: "text",
    toolsNeeded: "text",
  },
  {
    name: "challenge_search_text",
    weights: {
      title: 10,
      "targetOutcome.outcomeStatement": 8,
      skillsNeeded: 6,
      toolsNeeded: 5,
      tags: 4,
      description: 2,
    },
  },
);

export const Challenge =
  mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);

export default Challenge;
