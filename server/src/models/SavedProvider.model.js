import mongoose from "mongoose";
import {
  SAVED_PROVIDER_SOURCE_VALUES,
  SAVED_PROVIDER_STATUS,
  SAVED_PROVIDER_STATUS_VALUES,
} from "../constants/index.js";

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

const compareSnapshotSchema = new mongoose.Schema(
  {
    approvalRate: {
      max: 100,
      min: 0,
      type: Number,
    },
    availability: {
      default: "",
      maxlength: 80,
      trim: true,
      type: String,
    },
    categories: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 80),
      type: [String],
    },
    completedOutcomes: {
      min: 0,
      type: Number,
    },
    headline: {
      default: "",
      maxlength: 180,
      trim: true,
      type: String,
    },
    onTimeRate: {
      max: 100,
      min: 0,
      type: Number,
    },
    proofScore: {
      max: 100,
      min: 0,
      type: Number,
    },
    savedAt: {
      default: Date.now,
      type: Date,
    },
    skills: {
      default: [],
      set: (values) => normalizeStringList(values, 30, 50),
      type: [String],
    },
  },
  { _id: false },
);

const savedProviderSchema = new mongoose.Schema(
  {
    challengeId: {
      default: null,
      index: true,
      ref: "Challenge",
      type: mongoose.Schema.Types.ObjectId,
    },
    clientId: {
      index: true,
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    compareSnapshot: {
      default: () => ({}),
      type: compareSnapshotSchema,
    },
    note: {
      default: "",
      maxlength: 1000,
      trim: true,
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
      default: "provider_discovery",
      enum: SAVED_PROVIDER_SOURCE_VALUES,
      index: true,
      type: String,
    },
    status: {
      default: SAVED_PROVIDER_STATUS.SAVED,
      enum: SAVED_PROVIDER_STATUS_VALUES,
      index: true,
      type: String,
    },
    tags: {
      default: [],
      set: (values) => normalizeStringList(values, 20, 50),
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

savedProviderSchema.index(
  { clientId: 1, providerId: 1 },
  {
    partialFilterExpression: { challengeId: null },
    unique: true,
  },
);
savedProviderSchema.index(
  { challengeId: 1, clientId: 1, providerId: 1 },
  {
    partialFilterExpression: { challengeId: { $type: "objectId" } },
    unique: true,
  },
);
savedProviderSchema.index({ clientId: 1, status: 1 });
savedProviderSchema.index({ clientId: 1, createdAt: -1 });

export const SavedProvider = mongoose.model("SavedProvider", savedProviderSchema);
