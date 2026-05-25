import mongoose from "mongoose";

const userMediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    size: {
      type: Number,
      default: 0,
      min: 0,
    },
    type: {
      type: String,
      enum: ["avatar", "cover", "document"],
      required: true,
      index: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    provider: {
      type: String,
      enum: ["local", "cloudinary"],
      default: "local",
      index: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userMediaSchema.index({ userId: 1, type: 1, uploadedAt: -1 });

export const UserMedia = mongoose.model("UserMedia", userMediaSchema);
