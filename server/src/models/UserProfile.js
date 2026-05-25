import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      default: "",
      trim: true,
    },
    github: {
      type: String,
      default: "",
      trim: true,
    },
    instagram: {
      type: String,
      default: "",
      trim: true,
    },
    linkedin: {
      type: String,
      default: "",
      trim: true,
    },
    twitter: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const mediaSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const analyticsSchema = new mongoose.Schema(
  {
    postImpressions: {
      type: Number,
      default: 0,
      min: 0,
    },
    profileViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    searchAppearances: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastViewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const openToSchema = new mongoose.Schema(
  {
    categories: {
      type: [String],
      default: [],
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

const verificationBadgeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "Verified",
      trim: true,
      maxlength: 80,
    },
    status: {
      type: String,
      enum: ["none", "pending", "verified", "rejected"],
      default: "none",
      index: true,
    },
    requestedAt: {
      type: Date,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    requestNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    verificationType: {
      type: String,
      default: "identity",
      trim: true,
      maxlength: 40,
    },
    website: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    supportingLinks: {
      type: [String],
      default: [],
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const profileCompletionSchema = new mongoose.Schema(
  {
    missingFields: {
      type: [String],
      default: [],
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  },
);

const privacySettingsSchema = new mongoose.Schema(
  {
    allowDiscovery: {
      type: Boolean,
      default: true,
    },
    allowProviderListing: {
      type: Boolean,
      default: true,
    },
    allowSearchIndexing: {
      type: Boolean,
      default: false,
    },
    showActivity: {
      type: Boolean,
      default: true,
    },
    showEducation: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    showExperience: {
      type: Boolean,
      default: true,
    },
    showOpenTo: {
      type: Boolean,
      default: true,
    },
    showPhone: {
      type: Boolean,
      default: false,
    },
    showProofScore: {
      type: Boolean,
      default: true,
    },
    showServices: {
      type: Boolean,
      default: true,
    },
    showSocialLinks: {
      type: Boolean,
      default: true,
    },
    showWebsite: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const activitySummarySchema = new mongoose.Schema(
  {
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
    milestoneUpdatesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    proofUpdatesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1200,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    employmentType: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    order: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    startDate: {
      type: Date,
      default: null,
    },
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
  },
);

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      default: "",
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1200,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    endDate: {
      type: Date,
      default: null,
    },
    fieldOfStudy: {
      type: String,
      default: "",
      trim: true,
      maxlength: 140,
    },
    grade: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    institution: {
      type: String,
      default: "",
      trim: true,
      maxlength: 140,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    order: {
      type: Number,
      default: 0,
    },
    school: {
      type: String,
      default: "",
      trim: true,
      maxlength: 140,
    },
    startDate: {
      type: Date,
      default: null,
    },
  },
);

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      maxlength: 10,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 800,
    },
    deliveryType: {
      type: String,
      default: "",
      trim: true,
      maxlength: 40,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    startingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    proofRequired: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
  },
);

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
      index: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    companyName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    coverImage: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ publicId: "", url: "" }),
    },
    businessType: {
      type: String,
      enum: ["individual", "startup", "agency", "company", "enterprise"],
      default: "individual",
      trim: true,
    },
    connectionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentCompany: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    currentPosition: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    educationHeadline: {
      type: String,
      default: "",
      trim: true,
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    headline: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    industry: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        city: "",
        country: "",
        state: "",
        timezone: "",
      }),
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },
    profilePicture: {
      type: String,
      default: "",
      trim: true,
    },
    profileVisibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
      index: true,
    },
    privacySettings: {
      type: privacySettingsSchema,
      default: () => ({}),
    },
    analytics: {
      type: analyticsSchema,
      default: () => ({}),
    },
    activitySummary: {
      type: activitySummarySchema,
      default: () => ({}),
    },
    openTo: {
      type: openToSchema,
      default: () => ({}),
    },
    verificationBadge: {
      type: verificationBadgeSchema,
      default: () => ({}),
    },
    postImpressions: {
      type: Number,
      default: 0,
      min: 0,
    },
    profileCompletion: {
      type: profileCompletionSchema,
      default: () => ({}),
    },
    profileViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    searchAppearances: {
      type: Number,
      default: 0,
      min: 0,
    },
    skills: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    services: {
      type: [serviceSchema],
      default: [],
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userProfileSchema.index({ userId: 1, availabilityStatus: 1 });
userProfileSchema.index({ userId: 1, profileVisibility: 1 });

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
