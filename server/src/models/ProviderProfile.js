import mongoose from "mongoose";
import { PROVIDER_BADGE_KEY_VALUES } from "../constants/index.js";

const experienceLevels = ["entry", "intermediate", "expert"];
const availabilityStatuses = ["available", "limited", "unavailable"];
const moderationStatuses = ["pending", "active", "rejected", "suspended"];
const verificationStatuses = ["none", "pending", "verified", "rejected"];

function normalizeStringList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  );
}

const providerStatsSchema = new mongoose.Schema(
  {
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    completedProjects: {
      type: Number,
      min: 0,
      default: 0,
    },
    profileViews: {
      type: Number,
      min: 0,
      default: 0,
    },
    responseTime: {
      type: String,
      default: "Usually responds within 24 hours",
      trim: true,
      maxlength: 80,
    },
    serviceViews: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalReviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalServices: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const firstClientModeSchema = new mongoose.Schema(
  {
    completed: {
      default: false,
      type: Boolean,
    },
    completedAt: {
      default: null,
      type: Date,
    },
    enabled: {
      default: true,
      type: Boolean,
    },
    firstVerifiedOutcomeId: {
      default: null,
      ref: "VerifiedOutcome",
      type: mongoose.Schema.Types.ObjectId,
    },
    lastCalculatedAt: {
      default: null,
      type: Date,
    },
    readinessScore: {
      default: 0,
      max: 100,
      min: 0,
      type: Number,
    },
    starterChallengesApplied: {
      default: 0,
      min: 0,
      type: Number,
    },
    starterChallengesWon: {
      default: 0,
      min: 0,
      type: Number,
    },
  },
  {
    _id: false,
  },
);

const onboardingProgressSchema = new mongoose.Schema(
  {
    executionPlanSubmitted: {
      default: false,
      type: Boolean,
    },
    firstChallengeWon: {
      default: false,
      type: Boolean,
    },
    firstProofSubmitted: {
      default: false,
      type: Boolean,
    },
    firstVerifiedOutcome: {
      default: false,
      type: Boolean,
    },
    outcomeOfferCreated: {
      default: false,
      type: Boolean,
    },
    profileCompleted: {
      default: false,
      type: Boolean,
    },
    proofAssetAdded: {
      default: false,
      type: Boolean,
    },
    shortlistedOnce: {
      default: false,
      type: Boolean,
    },
  },
  {
    _id: false,
  },
);

const providerBadgeSchema = new mongoose.Schema(
  {
    description: {
      default: "",
      maxlength: 500,
      trim: true,
      type: String,
    },
    earnedAt: {
      default: Date.now,
      type: Date,
    },
    key: {
      enum: PROVIDER_BADGE_KEY_VALUES,
      required: true,
      type: String,
    },
    label: {
      maxlength: 120,
      required: true,
      trim: true,
      type: String,
    },
    source: {
      default: "system",
      enum: ["system", "admin", "challenge", "execution_plan", "proof"],
      type: String,
    },
  },
  {
    _id: false,
  },
);

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    headline: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },
    professionalSummary: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1200,
    },
    hourlyRate: {
      type: Number,
      min: 0,
      default: 0,
    },
    fixedStartingPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
      set: normalizeStringList,
    },
    categories: {
      type: [String],
      default: [],
      index: true,
      set: normalizeStringList,
    },
    portfolioItems: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Portfolio",
        },
      ],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: experienceLevels,
      default: "intermediate",
      index: true,
    },
    languages: {
      type: [String],
      default: [],
      index: true,
      set: normalizeStringList,
    },
    availability: {
      type: String,
      enum: availabilityStatuses,
      default: "available",
      index: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true,
    },
    completedProjects: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    completedOutcomes: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    totalProofsApproved: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    onTimeRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    approvalRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    proofScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      index: true,
    },
    ratingAverage: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalChallengesWon: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalChallengesApplied: {
      type: Number,
      min: 0,
      default: 0,
    },
    moderationStatus: {
      type: String,
      enum: moderationStatuses,
      default: "active",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    firstClientMode: {
      default: () => ({}),
      type: firstClientModeSchema,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isAvailableForChallenges: {
      type: Boolean,
      default: true,
      index: true,
    },
    onboardingProgress: {
      default: () => ({}),
      type: onboardingProgressSchema,
    },
    searchBoost: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      index: true,
    },
    moderationNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    moderationReviewedAt: {
      type: Date,
      default: null,
    },
    moderationReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: verificationStatuses,
      default: "none",
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verificationDocuments: {
      type: [
        {
          fileName: {
            type: String,
            default: "",
            trim: true,
          },
          mimeType: {
            type: String,
            default: "",
            trim: true,
          },
          publicId: {
            type: String,
            default: "",
            trim: true,
          },
          size: {
            type: Number,
            min: 0,
            default: 0,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
          url: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      default: [],
    },
    stats: {
      type: providerStatsSchema,
      default: () => ({}),
    },
    providerBadges: {
      default: [],
      type: [providerBadgeSchema],
      validate: {
        message: "Provider badges cannot include duplicates",
        validator(value) {
          const keys = value.map((badge) => badge.key);
          return keys.length === new Set(keys).size;
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

providerProfileSchema.index({ moderationStatus: 1, featured: -1, searchBoost: -1 });
providerProfileSchema.index({ verificationStatus: 1, verifiedAt: -1 });
providerProfileSchema.index({ availability: 1, rating: -1, completedProjects: -1 });
providerProfileSchema.index({ categories: 1, rating: -1 });
providerProfileSchema.index({ skills: 1, rating: -1 });
providerProfileSchema.index({ hourlyRate: 1, rating: -1 });
providerProfileSchema.index({ "stats.profileViews": -1 });
providerProfileSchema.index({ userId: 1, availability: 1 });
providerProfileSchema.index({ "firstClientMode.readinessScore": -1 });
providerProfileSchema.index(
  {
    title: "text",
  },
  {
    name: "provider_profile_text",
    weights: {
      title: 10,
    },
  },
);

export const ProviderProfile = mongoose.model(
  "ProviderProfile",
  providerProfileSchema,
);
