import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
      index: true,
    },
    authorName: {
      type: String,
      default: "",
      trim: true,
    },
    heading: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
      index: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.pre("validate", function normalizeReviewContent() {
  if (this.isModified("stars") && !this.isModified("rating")) {
    this.rating = this.stars;
  }

  if (this.isModified("rating") && !this.isModified("stars")) {
    this.stars = this.rating;
  }

  if (!this.comment && this.description) {
    this.comment = this.description;
  }

  if (!this.description && this.comment) {
    this.description = this.comment;
  }

  if (!this.rating && this.stars) {
    this.rating = this.stars;
  }

  if (!this.stars && this.rating) {
    this.stars = this.rating;
  }

  if (!this.authorName && this.reviewerId) {
    this.authorName = "Reviewer";
  }

  if (!this.heading && this.projectId) {
    this.heading = "Project review";
  }
});

reviewSchema.index({ status: 1, featured: -1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ reviewerId: 1, createdAt: -1 });
reviewSchema.index({ targetUserId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ providerId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ serviceId: 1, status: 1, createdAt: -1 });
reviewSchema.index(
  { projectId: 1, reviewerId: 1 },
  {
    partialFilterExpression: {
      projectId: { $type: "objectId" },
      reviewerId: { $type: "objectId" },
    },
    unique: true,
  },
);

export const Review = mongoose.model("Review", reviewSchema);
