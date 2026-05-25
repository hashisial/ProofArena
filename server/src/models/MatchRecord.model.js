import mongoose from "mongoose";
import {
  MATCH_DIRECTION,
  MATCH_DIRECTION_VALUES,
  MATCH_SOURCE,
  MATCH_SOURCE_VALUES,
  MATCH_STATUS,
  MATCH_STATUS_VALUES,
} from "../constants/index.js";
import { baseSchemaOptions } from "./base.model.js";

function normalizeStringList(values, maxItems = 20, maxLength = 120) {
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

const scoreBreakdownSchema = new mongoose.Schema(
  {
    availabilityScore: { default: 0, max: 10, min: 0, type: Number },
    budgetScore: { default: 0, max: 10, min: 0, type: Number },
    categoryScore: { default: 0, max: 15, min: 0, type: Number },
    locationScore: { default: 0, max: 5, min: 0, type: Number },
    outcomeScore: { default: 0, max: 15, min: 0, type: Number },
    proofScore: { default: 0, max: 10, min: 0, type: Number },
    qualityScore: { default: 0, max: 5, min: 0, type: Number },
    skillScore: { default: 0, max: 20, min: 0, type: Number },
    timelineScore: { default: 0, max: 5, min: 0, type: Number },
    toolScore: { default: 0, max: 10, min: 0, type: Number },
  },
  { _id: false },
);

const metadataSchema = new mongoose.Schema(
  {
    challengeBudgetType: { default: "", trim: true, type: String },
    matchedCategories: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 80),
      type: [String],
    },
    matchedOfferIds: {
      default: [],
      ref: "OutcomeOffer",
      type: [mongoose.Schema.Types.ObjectId],
    },
    matchedOutcomeKeywords: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 80),
      type: [String],
    },
    matchedSkillNames: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    matchedToolNames: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
    providerAvailability: { default: "", trim: true, type: String },
  },
  { _id: false },
);

const matchRecordSchema = new mongoose.Schema(
  {
    appliedAt: { default: null, type: Date },
    challengeId: {
      index: true,
      ref: "Challenge",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    clientId: {
      index: true,
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    clientViewedAt: { default: null, type: Date },
    direction: {
      default: MATCH_DIRECTION.BOTH,
      enum: MATCH_DIRECTION_VALUES,
      type: String,
    },
    dismissedAt: { default: null, type: Date },
    expiresAt: {
      default: null,
      index: true,
      type: Date,
    },
    invitedAt: { default: null, type: Date },
    matchReasons: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 220),
      type: [String],
    },
    matchScore: {
      index: true,
      max: 100,
      min: 0,
      required: true,
      type: Number,
    },
    metadata: {
      default: () => ({}),
      type: metadataSchema,
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
    providerViewedAt: { default: null, type: Date },
    recommendedAction: {
      default: "",
      maxlength: 300,
      trim: true,
      type: String,
    },
    savedAt: { default: null, type: Date },
    scoreBreakdown: {
      default: () => ({}),
      type: scoreBreakdownSchema,
    },
    source: {
      default: MATCH_SOURCE.RULE_BASED,
      enum: MATCH_SOURCE_VALUES,
      index: true,
      type: String,
    },
    status: {
      default: MATCH_STATUS.NEW,
      enum: MATCH_STATUS_VALUES,
      index: true,
      type: String,
    },
    weaknesses: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 220),
      type: [String],
    },
  },
  baseSchemaOptions,
);

matchRecordSchema.index({ providerId: 1, challengeId: 1 }, { unique: true });
matchRecordSchema.index({ providerId: 1, status: 1, matchScore: -1 });
matchRecordSchema.index({ challengeId: 1, status: 1, matchScore: -1 });
matchRecordSchema.index({ clientId: 1, challengeId: 1 });
matchRecordSchema.index({ matchScore: -1, createdAt: -1 });
matchRecordSchema.index({ source: 1, createdAt: -1 });
matchRecordSchema.index({ expiresAt: 1, status: 1 });

export const MatchRecord =
  mongoose.models.MatchRecord ||
  mongoose.model("MatchRecord", matchRecordSchema);

export default MatchRecord;
