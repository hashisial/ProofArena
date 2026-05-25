import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    results: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "none"],
      default: "image",
    },
    beforeState: {
      type: String,
      default: "",
      trim: true,
    },
    afterState: {
      type: String,
      default: "",
      trim: true,
    },
    testimonial: {
      type: String,
      default: "",
      trim: true,
    },
    clientName: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

portfolioSchema.index({ industry: 1, createdAt: -1 });
portfolioSchema.index({ createdAt: -1 });
portfolioSchema.index({ userId: 1, industry: 1, createdAt: -1 });

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
