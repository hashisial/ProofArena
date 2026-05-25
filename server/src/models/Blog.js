import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "none"],
      default: "none",
    },
    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },
    seoDescription: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    placement: {
      type: String,
      enum: ["blogs", "home", "services", "portfolio", "contact"],
      default: "blogs",
      index: true,
    },
    authorName: {
      type: String,
      default: "ScaleOps Team",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

blogSchema.index({ status: 1, placement: 1, createdAt: -1 });
blogSchema.index({ createdAt: -1 });

export const Blog = mongoose.model("Blog", blogSchema);
