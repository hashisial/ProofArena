import mongoose from "mongoose";

const outreachEmailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
      default: null,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OutreachJob",
      default: null,
      index: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
      index: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["queued", "sent", "skipped", "failed"],
      required: true,
      index: true,
    },
    errorMessage: {
      type: String,
      default: "",
      trim: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

outreachEmailSchema.index({ userId: 1, createdAt: -1 });
outreachEmailSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const OutreachEmail = mongoose.model("OutreachEmail", outreachEmailSchema);
