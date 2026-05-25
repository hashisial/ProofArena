import mongoose from "mongoose";

const activityTypes = [
  "profile_updated",
  "lead_created",
  "campaign_started",
  "login",
  "subscription_updated",
  "settings_updated",
];

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: activityTypes,
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });

export const UserActivity = mongoose.model("UserActivity", userActivitySchema);
