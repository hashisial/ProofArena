import mongoose from "mongoose";

const outreachJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
      required: true,
      index: true,
    },
    statusFilter: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed", "all"],
      default: "new",
      index: true,
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
      index: true,
    },
    targetCount: {
      type: Number,
      default: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    skippedCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
      trim: true,
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

outreachJobSchema.index({ userId: 1, createdAt: -1 });
outreachJobSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const OutreachJob = mongoose.model("OutreachJob", outreachJobSchema);
