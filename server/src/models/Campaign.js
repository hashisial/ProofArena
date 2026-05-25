import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    template: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "running", "paused", "completed"],
      default: "draft",
      index: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    leads: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Lead",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });
campaignSchema.index({ scheduledAt: 1, status: 1 });

export const Campaign = mongoose.model("Campaign", campaignSchema);
