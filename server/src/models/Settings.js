import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    emailPreferences: {
      campaignReplies: {
        type: Boolean,
        default: true,
      },
      productUpdates: {
        type: Boolean,
        default: true,
      },
      weeklySummary: {
        type: Boolean,
        default: true,
      },
    },
    notificationPreferences: {
      billing: {
        type: Boolean,
        default: true,
      },
      campaign: {
        type: Boolean,
        default: true,
      },
      system: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Settings = mongoose.model("Settings", settingsSchema);
