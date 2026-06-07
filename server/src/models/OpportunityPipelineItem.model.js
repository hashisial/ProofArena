import mongoose from "mongoose";
import {
  LOST_REASON_VALUES,
  OPPORTUNITY_PRIORITY,
  OPPORTUNITY_PRIORITY_VALUES,
  OPPORTUNITY_SOURCE,
  OPPORTUNITY_SOURCE_VALUES,
  OPPORTUNITY_STAGE,
  OPPORTUNITY_STAGE_VALUES,
} from "../constants/index.js";
import { baseSchemaOptions } from "./base.model.js";

function normalizeStringList(values, maxItems = 20, maxLength = 50) {
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

const valueSchema = new mongoose.Schema(
  {
    amount: { min: 0, type: Number },
    currency: { default: "USD", maxlength: 10, trim: true, uppercase: true, type: String },
    type: {
      default: "unknown",
      enum: ["fixed", "range", "hourly", "milestone", "unknown"],
      type: String,
    },
  },
  { _id: false },
);

const nextActionSchema = new mongoose.Schema(
  {
    completed: { default: false, type: Boolean },
    completedAt: Date,
    description: { default: "", maxlength: 500, trim: true, type: String },
    dueAt: Date,
    title: { default: "", maxlength: 160, trim: true, type: String },
  },
  { _id: false },
);

const lostInfoSchema = new mongoose.Schema(
  {
    note: { default: "", maxlength: 1000, trim: true, type: String },
    reason: { enum: LOST_REASON_VALUES, type: String },
    recordedAt: Date,
  },
  { _id: false },
);

const noteSchema = new mongoose.Schema(
  {
    body: { maxlength: 1000, required: true, trim: true, type: String },
    createdAt: { default: Date.now, type: Date },
  },
  { _id: false },
);

const opportunityPipelineItemSchema = new mongoose.Schema(
  {
    challengeId: {
      index: true,
      ref: "Challenge",
      type: mongoose.Schema.Types.ObjectId,
    },
    clientId: {
      default: null,
      index: true,
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    executionPlanId: {
      index: true,
      ref: "ExecutionPlan",
      type: mongoose.Schema.Types.ObjectId,
    },
    lastActivityAt: {
      default: Date.now,
      index: true,
      type: Date,
    },
    lostInfo: {
      default: () => ({}),
      type: lostInfoSchema,
    },
    matchRecordId: {
      index: true,
      ref: "MatchRecord",
      type: mongoose.Schema.Types.ObjectId,
    },
    matchScore: {
      max: 100,
      min: 0,
      type: Number,
    },
    nextAction: {
      default: () => ({}),
      type: nextActionSchema,
    },
    notes: {
      default: [],
      type: [noteSchema],
    },
    outcomeOfferId: {
      default: null,
      index: true,
      ref: "OutcomeOffer",
      type: mongoose.Schema.Types.ObjectId,
    },
    priority: {
      default: OPPORTUNITY_PRIORITY.NORMAL,
      enum: OPPORTUNITY_PRIORITY_VALUES,
      index: true,
      type: String,
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
    source: {
      default: OPPORTUNITY_SOURCE.MANUAL,
      enum: OPPORTUNITY_SOURCE_VALUES,
      index: true,
      type: String,
    },
    stage: {
      default: OPPORTUNITY_STAGE.MATCHED,
      enum: OPPORTUNITY_STAGE_VALUES,
      index: true,
      type: String,
    },
    summary: {
      default: "",
      maxlength: 700,
      trim: true,
      type: String,
    },
    tags: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 50),
      type: [String],
    },
    title: {
      maxlength: 180,
      required: true,
      trim: true,
      type: String,
    },
    value: {
      default: () => ({ type: "unknown" }),
      type: valueSchema,
    },
  },
  baseSchemaOptions,
);

opportunityPipelineItemSchema.index({ providerId: 1, stage: 1, lastActivityAt: -1 });
opportunityPipelineItemSchema.index(
  { providerId: 1, challengeId: 1 },
  { partialFilterExpression: { challengeId: { $exists: true } }, unique: true },
);
opportunityPipelineItemSchema.index(
  { providerId: 1, executionPlanId: 1 },
  { partialFilterExpression: { executionPlanId: { $exists: true } }, unique: true },
);
opportunityPipelineItemSchema.index(
  { providerId: 1, matchRecordId: 1 },
  { partialFilterExpression: { matchRecordId: { $exists: true } }, unique: true },
);
opportunityPipelineItemSchema.index({ source: 1, lastActivityAt: -1 });
opportunityPipelineItemSchema.index({ priority: 1, lastActivityAt: -1 });
opportunityPipelineItemSchema.index({ title: "text", summary: "text", tags: "text" });

export const OpportunityPipelineItem =
  mongoose.models.OpportunityPipelineItem ||
  mongoose.model("OpportunityPipelineItem", opportunityPipelineItemSchema);

export default OpportunityPipelineItem;
