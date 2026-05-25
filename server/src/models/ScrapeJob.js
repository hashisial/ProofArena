import mongoose from "mongoose";

const scrapeJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
      index: true,
    },
    totalResults: {
      type: Number,
      default: 0,
      min: 0,
    },
    discoveredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    savedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    errorMessage: {
      type: String,
      default: "",
      trim: true,
    },
    leadIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Lead",
      default: [],
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

scrapeJobSchema.index({ userId: 1, createdAt: -1 });
scrapeJobSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const ScrapeJob = mongoose.model("ScrapeJob", scrapeJobSchema);
