import mongoose from "mongoose";
import {
  EXECUTION_PLAN_STATUS,
  EXECUTION_PLAN_STATUS_VALUES,
  PLAN_CAN_START,
  PLAN_CAN_START_VALUES,
  PLAN_PRICE_TYPE,
  PLAN_PRICE_TYPE_VALUES,
  PLAN_TIMELINE_TYPE,
  PLAN_TIMELINE_TYPE_VALUES,
  PLAN_UPDATE_FREQUENCY,
  PLAN_UPDATE_FREQUENCY_VALUES,
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

const timelineSchema = new mongoose.Schema(
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
    type: {
      enum: PLAN_TIMELINE_TYPE_VALUES,
      required: true,
      type: String,
    },
  },
  { _id: false },
);

const priceSchema = new mongoose.Schema(
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
      enum: PLAN_PRICE_TYPE_VALUES,
      required: true,
      type: String,
    },
  },
  { _id: false },
);

const milestoneSchema = new mongoose.Schema(
  {
    deliverable: {
      default: "",
      maxlength: 300,
      trim: true,
      type: String,
    },
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
    proofPlanned: {
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

const proofPlanSchema = new mongoose.Schema(
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
    relatedMilestoneOrder: {
      min: 0,
      type: Number,
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

const riskHandlingSchema = new mongoose.Schema(
  {
    mitigation: {
      maxlength: 500,
      required: true,
      trim: true,
      type: String,
    },
    risk: {
      maxlength: 200,
      required: true,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const communicationPlanSchema = new mongoose.Schema(
  {
    channels: {
      default: [],
      set: (values) => normalizeStringList(values, 10, 50),
      type: [String],
    },
    note: {
      default: "",
      maxlength: 300,
      trim: true,
      type: String,
    },
    updateFrequency: {
      default: PLAN_UPDATE_FREQUENCY.MILESTONE_BASED,
      enum: PLAN_UPDATE_FREQUENCY_VALUES,
      type: String,
    },
  },
  { _id: false },
);

const availabilitySchema = new mongoose.Schema(
  {
    canStart: {
      default: PLAN_CAN_START.THIS_WEEK,
      enum: PLAN_CAN_START_VALUES,
      type: String,
    },
    customStartDate: {
      default: null,
      type: Date,
    },
    hoursPerWeek: {
      max: 80,
      min: 1,
      type: Number,
    },
    note: {
      default: "",
      maxlength: 300,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const attachmentSchema = new mongoose.Schema(
  {
    note: {
      default: "",
      maxlength: 300,
      trim: true,
      type: String,
    },
    title: {
      default: "",
      maxlength: 120,
      trim: true,
      type: String,
    },
    type: {
      enum: ["portfolio", "case_study", "document", "live_url", "github", "proof_asset", "other"],
      type: String,
    },
    url: {
      default: "",
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const clientFeedbackSchema = new mongoose.Schema(
  {
    acceptedNote: {
      default: "",
      maxlength: 1000,
      trim: true,
      type: String,
    },
    feedbackAt: {
      default: null,
      type: Date,
    },
    rejectionReason: {
      default: "",
      maxlength: 1000,
      trim: true,
      type: String,
    },
    shortlistNote: {
      default: "",
      maxlength: 1000,
      trim: true,
      type: String,
    },
  },
  { _id: false },
);

const planScoreSchema = new mongoose.Schema(
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
    strengths: {
      default: [],
      type: [String],
    },
    warnings: {
      default: [],
      type: [String],
    },
  },
  { _id: false },
);

const matchSnapshotSchema = new mongoose.Schema(
  {
    capturedAt: {
      default: null,
      type: Date,
    },
    matchReasons: {
      default: [],
      type: [String],
    },
    matchScore: {
      max: 100,
      min: 0,
      type: Number,
    },
  },
  { _id: false },
);

const statsSchema = new mongoose.Schema(
  {
    clientMessages: { default: 0, min: 0, type: Number },
    views: { default: 0, min: 0, type: Number },
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

const executionPlanSchema = new mongoose.Schema(
  {
    acceptedAt: {
      default: null,
      type: Date,
    },
    archivedAt: {
      default: null,
      type: Date,
    },
    aiMetadata: {
      default: () => ({}),
      type: aiMetadataSchema,
    },
    approach: {
      maxlength: 4000,
      required: true,
      trim: true,
      type: String,
    },
    attachments: {
      default: [],
      type: [attachmentSchema],
      validate: {
        message: "Attachments can include at most 10 items",
        validator(value) {
          return value.length <= 10;
        },
      },
    },
    availability: {
      default: () => ({ canStart: PLAN_CAN_START.THIS_WEEK }),
      type: availabilitySchema,
    },
    challengeId: {
      index: true,
      ref: "Challenge",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    clientFeedback: {
      default: () => ({}),
      type: clientFeedbackSchema,
    },
    communicationPlan: {
      default: () => ({ updateFrequency: PLAN_UPDATE_FREQUENCY.MILESTONE_BASED }),
      type: communicationPlanSchema,
    },
    matchSnapshot: {
      default: () => ({}),
      type: matchSnapshotSchema,
    },
    milestones: {
      required: true,
      type: [milestoneSchema],
      validate: {
        message: "At least one milestone is required",
        validator(value) {
          return value.length >= 1 && value.length <= 20;
        },
      },
    },
    outcomeOfferId: {
      default: null,
      index: true,
      ref: "OutcomeOffer",
      type: mongoose.Schema.Types.ObjectId,
    },
    planScore: {
      default: () => ({}),
      type: planScoreSchema,
    },
    price: {
      required: true,
      type: priceSchema,
    },
    proofPlan: {
      required: true,
      type: [proofPlanSchema],
      validate: {
        message: "At least one proof plan item is required",
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
    rejectedAt: {
      default: null,
      type: Date,
    },
    riskHandling: {
      default: [],
      type: [riskHandlingSchema],
      validate: {
        message: "Risk handling can include at most 10 items",
        validator(value) {
          return value.length <= 10;
        },
      },
    },
    shortlistedAt: {
      default: null,
      type: Date,
    },
    skills: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    stats: {
      default: () => ({}),
      type: statsSchema,
    },
    status: {
      default: EXECUTION_PLAN_STATUS.SUBMITTED,
      enum: EXECUTION_PLAN_STATUS_VALUES,
      index: true,
      type: String,
    },
    submittedAt: {
      default: null,
      index: true,
      type: Date,
    },
    summary: {
      maxlength: 500,
      required: true,
      trim: true,
      type: String,
    },
    timeline: {
      required: true,
      type: timelineSchema,
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
    viewedAt: {
      default: null,
      type: Date,
    },
    whyThisProvider: {
      default: "",
      maxlength: 1500,
      trim: true,
      type: String,
    },
    withdrawnAt: {
      default: null,
      type: Date,
    },
  },
  baseSchemaOptions,
);

executionPlanSchema.index(
  { challengeId: 1, providerId: 1 },
  {
    name: "one_active_execution_plan_per_provider_challenge",
    partialFilterExpression: {
      status: {
        $in: [
          EXECUTION_PLAN_STATUS.DRAFT,
          EXECUTION_PLAN_STATUS.SUBMITTED,
          EXECUTION_PLAN_STATUS.VIEWED,
          EXECUTION_PLAN_STATUS.SHORTLISTED,
          EXECUTION_PLAN_STATUS.ACCEPTED,
        ],
      },
    },
    unique: true,
  },
);
executionPlanSchema.index({ challengeId: 1, status: 1, submittedAt: -1 });
executionPlanSchema.index({ providerId: 1, status: 1, submittedAt: -1 });
executionPlanSchema.index({ createdAt: -1 });

export const ExecutionPlan =
  mongoose.models.ExecutionPlan ||
  mongoose.model("ExecutionPlan", executionPlanSchema);

export default ExecutionPlan;
