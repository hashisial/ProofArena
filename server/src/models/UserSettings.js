import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "en",
      trim: true,
    },
    profileVisibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
      index: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

userSettingsSchema.index({ userId: 1, profileVisibility: 1 });

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
