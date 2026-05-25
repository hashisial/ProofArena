import mongoose from "mongoose";

export const servicePricingTypes = ["fixed", "hourly", "custom"];
export const serviceStatuses = [
  "draft",
  "pending_review",
  "active",
  "rejected",
  "paused",
];

function createSlug(value, id) {
  const base = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return `${base || "service"}-${String(id).slice(-6)}`;
}

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

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 140,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 80,
      index: true,
    },
    subCategory: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 280,
    },
    pricingType: {
      type: String,
      enum: servicePricingTypes,
      required: true,
      default: "fixed",
      index: true,
    },
    fixedPrice: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    hourlyRate: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    deliveryTime: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    revisions: {
      type: Number,
      min: 0,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
      set: normalizeStringList,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
      set: normalizeStringList,
    },
    images: {
      type: [String],
      default: [],
      set: normalizeStringList,
    },
    status: {
      type: String,
      enum: serviceStatuses,
      default: "draft",
      index: true,
    },
    ratingAverage: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true,
    },
    totalReviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalOrders: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    moderationNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    saveCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    viewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

serviceSchema.pre("validate", function normalizeService() {
  if (!this.slug || this.isModified("title")) {
    this.slug = createSlug(this.title, this._id);
  }

  if (!this.shortDescription && this.description) {
    this.shortDescription = String(this.description).slice(0, 240);
  }

  if (this.pricingType === "fixed" && this.fixedPrice < 0) {
    this.fixedPrice = 0;
  }

  if (this.pricingType === "hourly" && this.hourlyRate < 0) {
    this.hourlyRate = 0;
  }

  if (this.status === "active" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ category: 1, status: 1, createdAt: -1 });
serviceSchema.index({ category: 1, status: 1, ratingAverage: -1, totalOrders: -1 });
serviceSchema.index({ providerId: 1, status: 1, createdAt: -1 });
serviceSchema.index({ status: 1, fixedPrice: 1, ratingAverage: -1 });
serviceSchema.index({ status: 1, hourlyRate: 1, ratingAverage: -1 });
serviceSchema.index({ status: 1, ratingAverage: -1, totalOrders: -1 });
serviceSchema.index({ status: 1, totalOrders: -1, ratingAverage: -1 });
serviceSchema.index({ tags: 1, status: 1 });
serviceSchema.index({ title: 1, status: 1 });
serviceSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
serviceSchema.index(
  {
    category: "text",
    description: "text",
    shortDescription: "text",
    skills: "text",
    subCategory: "text",
    tags: "text",
    title: "text",
  },
  {
    name: "service_search_text",
    weights: {
      title: 10,
      category: 6,
      tags: 5,
      skills: 5,
      subCategory: 4,
      shortDescription: 4,
      description: 2,
    },
  },
);

export const Service = mongoose.model("Service", serviceSchema);
