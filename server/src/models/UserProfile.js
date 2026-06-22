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
    allowClientInvites: {
      type: Boolean,
      default: false,
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
    showAvailability: {
      type: Boolean,
      default: false,
    },
    showCaseStudies: {
      type: Boolean,
      default: false,
    },
    showCertifications: {
      type: Boolean,
      default: false,
    },
    showExperience: {
      type: Boolean,
      default: true,
    },
    showLocation: {
      type: Boolean,
      default: false,
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
    showProofHighlights: {
      type: Boolean,
      default: false,
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

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    level: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "owner",
      enum: ["owner", "system", "admin", "verification", "proof"],
    },
  },
  { _id: false },
);

const publicAssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1200,
    },
    url: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const scorePlaceholderSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    level: {
      type: String,
      default: null,
      trim: true,
      maxlength: 40,
    },
    calculatedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      default: "not_calculated",
      enum: ["not_calculated", "system", "admin", "ai_audit", "proof_engine"],
    },
  },
  { _id: false },
);

const verificationStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "not_started",
      enum: ["not_started", "pending", "verified", "rejected", "expired", "unavailable"],
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
  },
  { _id: false },
);

const stage4IdentitySchema = new mongoose.Schema(
  {
    displayName: { type: String, default: "", trim: true, maxlength: 120 },
    firstName: { type: String, default: "", trim: true, maxlength: 80 },
    lastName: { type: String, default: "", trim: true, maxlength: 80 },
    username: { type: String, default: "", trim: true, lowercase: true, maxlength: 40 },
    avatarUrl: { type: String, default: "", trim: true, maxlength: 500 },
    avatarAssetId: { type: String, default: "", trim: true, maxlength: 240 },
    coverUrl: { type: String, default: "", trim: true, maxlength: 500 },
    coverAssetId: { type: String, default: "", trim: true, maxlength: 240 },
    contactEmail: { type: String, default: "", trim: true, lowercase: true, maxlength: 180 },
    contactPhone: { type: String, default: "", trim: true, maxlength: 40 },
    location: {
      city: { type: String, default: "", trim: true, maxlength: 100 },
      state: { type: String, default: "", trim: true, maxlength: 100 },
      country: { type: String, default: "", trim: true, maxlength: 100 },
      timezone: { type: String, default: "", trim: true, maxlength: 100 },
    },
    timezone: { type: String, default: "", trim: true, maxlength: 100 },
    language: { type: String, default: "en", trim: true, maxlength: 20 },
    accountType: { type: String, default: "individual", trim: true, maxlength: 80 },
  },
  { _id: false },
);

const professionalIdentitySchema = new mongoose.Schema(
  {
    headline: { type: String, default: "", trim: true, maxlength: 180 },
    bio: { type: String, default: "", trim: true, maxlength: 2400 },
    industry: { type: String, default: "", trim: true, maxlength: 120 },
    niche: { type: String, default: "", trim: true, maxlength: 120 },
    targetClient: { type: String, default: "", trim: true, maxlength: 240 },
    yearsOfExperience: { type: Number, default: null, min: 0, max: 80 },
    experienceLevel: { type: String, default: "", trim: true, maxlength: 80 },
    openTo: { type: [String], default: [] },
    availabilityStatus: { type: String, default: "unavailable", trim: true, maxlength: 80 },
  },
  { _id: false },
);

const skillsProfileSchema = new mongoose.Schema(
  {
    skills: { type: [tagSchema], default: [] },
    tools: { type: [tagSchema], default: [] },
    platforms: { type: [tagSchema], default: [] },
    skillLevels: { type: [tagSchema], default: [] },
    verifiedSkills: { type: [tagSchema], default: [] },
    serviceCategories: { type: [String], default: [] },
  },
  { _id: false },
);

const servicesProfileSchema = new mongoose.Schema(
  {
    services: { type: [publicAssetSchema], default: [] },
    outcomeOfferRefs: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    pricingModels: { type: [String], default: [] },
    deliveryTimelines: { type: [String], default: [] },
    revisionPolicies: { type: [String], default: [] },
    preferredProjectTypes: { type: [String], default: [] },
  },
  { _id: false },
);

const proofProfileSchema = new mongoose.Schema(
  {
    portfolioItems: { type: [publicAssetSchema], default: [] },
    caseStudies: { type: [publicAssetSchema], default: [] },
    proofAssetRefs: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    certifications: { type: [publicAssetSchema], default: [] },
    achievements: { type: [publicAssetSchema], default: [] },
    publicProofHighlights: { type: [publicAssetSchema], default: [] },
  },
  { _id: false },
);

const businessReadinessSchema = new mongoose.Schema(
  {
    availability: { type: String, default: "", trim: true, maxlength: 120 },
    capacity: { type: String, default: "", trim: true, maxlength: 120 },
    paymentMethods: { type: [String], default: [] },
    taxReadiness: { type: String, default: "not_started", trim: true, maxlength: 80 },
    invoiceSettings: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
    preferredBudgetRange: { type: String, default: "", trim: true, maxlength: 120 },
    preferredClientType: { type: String, default: "", trim: true, maxlength: 120 },
    preferredProjectLength: { type: String, default: "", trim: true, maxlength: 120 },
  },
  { _id: false },
);

const trustVerificationSchema = new mongoose.Schema(
  {
    emailVerification: { type: verificationStatusSchema, default: () => ({}) },
    phoneVerification: { type: verificationStatusSchema, default: () => ({}) },
    idVerification: { type: verificationStatusSchema, default: () => ({}) },
    businessVerification: { type: verificationStatusSchema, default: () => ({}) },
    socialVerification: { type: verificationStatusSchema, default: () => ({}) },
    verificationBadge: {
      label: { type: String, default: "", trim: true, maxlength: 80 },
      status: { type: String, default: "none", enum: ["none", "pending", "verified", "rejected"] },
      verifiedAt: { type: Date, default: null },
    },
    proofScore: { type: scorePlaceholderSchema, default: () => ({}) },
    trustReadinessScore: { type: scorePlaceholderSchema, default: () => ({}) },
    profileStrengthScore: { type: scorePlaceholderSchema, default: () => ({}) },
  },
  { _id: false },
);

const matchingPreferencesSchema = new mongoose.Schema(
  {
    preferredIndustries: { type: [String], default: [] },
    preferredBudgets: { type: [String], default: [] },
    preferredClientTypes: { type: [String], default: [] },
    preferredProjectLengths: { type: [String], default: [] },
    preferredChallengeTypes: { type: [String], default: [] },
    excludedCategories: { type: [String], default: [] },
    timezonePreference: { type: String, default: "", trim: true, maxlength: 120 },
    responsePreference: { type: String, default: "", trim: true, maxlength: 120 },
  },
  { _id: false },
);

const growthIntelligenceSchema = new mongoose.Schema(
  {
    aiProfileAuditStatus: {
      type: String,
      default: "not_started",
      enum: ["not_started", "pending", "completed", "failed", "unavailable"],
    },
    missingRequirements: { type: [String], default: [] },
    growthSuggestions: { type: [String], default: [] },
    readinessChecklist: { type: [String], default: [] },
    lastAuditAt: { type: Date, default: null },
  },
  { _id: false },
);

const sectionProgressSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true, trim: true, maxlength: 80 },
    completedStepIds: { type: [String], default: [] },
    percent: { type: Number, default: 0, min: 0, max: 100 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const onboardingProgressSchema = new mongoose.Schema(
  {
    currentStepId: { type: String, default: "", trim: true, maxlength: 120 },
    completedStepIds: { type: [String], default: [] },
    skippedStepIds: { type: [String], default: [] },
    sectionProgress: { type: [sectionProgressSchema], default: [] },
    lastCompletedStepId: { type: String, default: "", trim: true, maxlength: 120 },
    lastEditedSection: { type: String, default: "", trim: true, maxlength: 80 },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
  },
  { _id: false },
);

const publishStateSchema = new mongoose.Schema(
  {
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    unpublishedAt: { type: Date, default: null },
    lastPublishAttemptAt: { type: Date, default: null },
    publishBlockedReasons: { type: [String], default: [] },
    publishReadinessStatus: {
      type: String,
      default: "not_evaluated",
      enum: ["not_evaluated", "blocked", "needs_review", "ready", "published"],
    },
    publicSnapshotVersion: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const systemMetaSchema = new mongoose.Schema(
  {
    lastCompletedStepId: { type: String, default: "", trim: true, maxlength: 120 },
    lastEditedSection: { type: String, default: "", trim: true, maxlength: 80 },
    lastSectionSavedAt: { type: Date, default: null },
    lastPublicPreviewAt: { type: Date, default: null },
  },
  { _id: false },
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
    ownerType: {
      type: String,
      enum: ["provider", "client", "admin_managed", "organization"],
      default: "provider",
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "incomplete", "review_ready", "published", "hidden", "suspended"],
      default: "draft",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["private", "public", "limited", "hidden"],
      default: "private",
      index: true,
    },
    identity: {
      type: stage4IdentitySchema,
      default: () => ({}),
    },
    professionalIdentity: {
      type: professionalIdentitySchema,
      default: () => ({}),
    },
    skillsProfile: {
      type: skillsProfileSchema,
      default: () => ({}),
    },
    servicesProfile: {
      type: servicesProfileSchema,
      default: () => ({}),
    },
    proofProfile: {
      type: proofProfileSchema,
      default: () => ({}),
    },
    businessReadiness: {
      type: businessReadinessSchema,
      default: () => ({}),
    },
    trustVerification: {
      type: trustVerificationSchema,
      default: () => ({}),
    },
    matchingPreferences: {
      type: matchingPreferencesSchema,
      default: () => ({}),
    },
    growthIntelligence: {
      type: growthIntelligenceSchema,
      default: () => ({}),
    },
    onboardingProgress: {
      type: onboardingProgressSchema,
      default: () => ({}),
    },
    publishState: {
      type: publishStateSchema,
      default: () => ({}),
    },
    systemMeta: {
      type: systemMetaSchema,
      default: () => ({}),
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
userProfileSchema.index({ status: 1, visibility: 1 });
userProfileSchema.index({ "professionalIdentity.industry": 1 });
userProfileSchema.index({ "professionalIdentity.niche": 1 });
userProfileSchema.index({ "skillsProfile.skills.name": 1 });
userProfileSchema.index({ "trustVerification.proofScore.value": -1 });
userProfileSchema.index({ "publishState.isPublished": 1, visibility: 1 });
userProfileSchema.index({ "privacySettings.allowDiscovery": 1 });
userProfileSchema.index({ updatedAt: -1 });

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
