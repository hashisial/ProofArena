import mongoose from "mongoose";
import {
  ADMIN_REVIEW_STATUS,
  ADMIN_REVIEW_STATUS_VALUES,
  CHALLENGE_BUDGET_TYPE_VALUES,
  CHALLENGE_BUDGET_TYPES,
  CHALLENGE_MODE,
  CHALLENGE_MODE_VALUES,
  CHALLENGE_STATUS,
  CHALLENGE_STATUS_VALUES,
  CHALLENGE_VISIBILITY,
  CHALLENGE_VISIBILITY_VALUES,
  PROOF_TYPE_VALUES,
} from "../constants/index.js";
import { baseSchemaOptions } from "./base.model.js";

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const successMetricSchema = new mongoose.Schema(
  {
    description: { maxlength: 1000, trim: true, type: String },
    name: { required: true, trim: true, type: String },
    targetValue: { min: 0, type: Number },
    unit: { default: "", trim: true, type: String },
  },
  { _id: false },
);

const requiredProofSchema = new mongoose.Schema(
  {
    description: { maxlength: 1000, trim: true, type: String },
    isRequired: { default: true, type: Boolean },
    proofType: { enum: PROOF_TYPE_VALUES, required: true, type: String },
  },
  { _id: false },
);

const outcomeChallengeSchema = new mongoose.Schema(
  {
    adminReviewNotes: { select: false, trim: true, type: String },
    adminReviewStatus: {
      default: ADMIN_REVIEW_STATUS.NOT_SUBMITTED,
      enum: ADMIN_REVIEW_STATUS_VALUES,
      type: String,
    },
    applicantCount: { default: 0, min: 0, type: Number },
    assignedProviders: [{ ref: "User", type: mongoose.Schema.Types.ObjectId }],
    budgetMax: {
      min: 0,
      type: Number,
      validate: {
        message: "Maximum budget must be greater than or equal to minimum budget",
        validator(value) {
          return value === undefined || this.budgetMin === undefined || value >= this.budgetMin;
        },
      },
    },
    budgetMin: { min: 0, type: Number },
    budgetType: {
      default: CHALLENGE_BUDGET_TYPES.RANGE,
      enum: CHALLENGE_BUDGET_TYPE_VALUES,
      type: String,
    },
    cancellationReason: { maxlength: 1000, trim: true, type: String },
    cancelledAt: Date,
    category: { index: true, required: true, trim: true, type: String },
    challengeMode: {
      default: CHALLENGE_MODE.OPEN_COMPETITION,
      enum: CHALLENGE_MODE_VALUES,
      index: true,
      type: String,
    },
    clientId: {
      index: true,
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    completedAt: Date,
    currency: { default: "USD", trim: true, type: String, uppercase: true },
    deadline: {
      required: true,
      type: Date,
      validate: {
        message: "Challenge deadline must be in the future",
        validator(value) {
          return !this.isNew || value > new Date();
        },
      },
    },
    description: { maxlength: 5000, trim: true, type: String },
    goalStatement: { maxlength: 1000, required: true, trim: true, type: String },
    industry: { index: true, trim: true, type: String },
    location: {
      city: { default: "", trim: true, type: String },
      country: { default: "", trim: true, type: String },
      isRemote: { default: true, type: Boolean },
      state: { default: "", trim: true, type: String },
    },
    proofSubmissionCount: { default: 0, min: 0, type: Number },
    requiredProof: [requiredProofSchema],
    shortlistedProviders: [{ ref: "User", type: mongoose.Schema.Types.ObjectId }],
    slug: { index: true, lowercase: true, required: true, trim: true, type: String, unique: true },
    status: {
      default: CHALLENGE_STATUS.DRAFT,
      enum: CHALLENGE_STATUS_VALUES,
      index: true,
      type: String,
    },
    successMetrics: [successMetricSchema],
    tags: [{ index: true, lowercase: true, trim: true, type: String }],
    targetOutcome: {
      metricName: { default: "", trim: true, type: String },
      targetValue: { min: 1, type: Number },
      unit: { default: "", trim: true, type: String },
    },
    title: { maxlength: 160, minlength: 10, required: true, trim: true, type: String },
    viewCount: { default: 0, min: 0, type: Number },
    visibility: {
      default: CHALLENGE_VISIBILITY.PUBLIC,
      enum: CHALLENGE_VISIBILITY_VALUES,
      index: true,
      type: String,
    },
  },
  baseSchemaOptions,
);

outcomeChallengeSchema.index({ createdAt: -1 });
outcomeChallengeSchema.index({ deadline: 1 });
outcomeChallengeSchema.index({
  description: "text",
  goalStatement: "text",
  tags: "text",
  title: "text",
});

outcomeChallengeSchema.pre("validate", function generateSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

outcomeChallengeSchema.methods.isOpen = function isOpen() {
  return this.status === CHALLENGE_STATUS.OPEN;
};

outcomeChallengeSchema.methods.isInProgress = function isInProgress() {
  return this.status === CHALLENGE_STATUS.IN_PROGRESS;
};

outcomeChallengeSchema.methods.isCompleted = function isCompleted() {
  return this.status === CHALLENGE_STATUS.COMPLETED;
};

outcomeChallengeSchema.methods.canReceiveEntries = function canReceiveEntries() {
  return [CHALLENGE_STATUS.OPEN, CHALLENGE_STATUS.SHORTLISTING].includes(this.status);
};

outcomeChallengeSchema.methods.markAsCompleted = function markAsCompleted() {
  this.status = CHALLENGE_STATUS.COMPLETED;
  this.completedAt = new Date();
  return this;
};

export const OutcomeChallenge =
  mongoose.models.OutcomeChallenge ||
  mongoose.model("OutcomeChallenge", outcomeChallengeSchema);

export default OutcomeChallenge;
