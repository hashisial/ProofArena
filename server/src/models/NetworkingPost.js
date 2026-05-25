import mongoose from "mongoose";

const postTypes = ["update", "work", "share"];
const mediaTypes = ["image", "video", "document", "link"];
const visibilityTypes = ["public", "connections"];

const networkingPostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2400,
    },
    type: {
      type: String,
      enum: postTypes,
      default: "update",
      index: true,
    },
    work: {
      title: {
        type: String,
        default: "",
        trim: true,
        maxlength: 180,
      },
      description: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },
      url: {
        type: String,
        default: "",
        trim: true,
        maxlength: 500,
      },
    },
    media: {
      type: [
        {
          name: {
            type: String,
            default: "",
            trim: true,
            maxlength: 180,
          },
          type: {
            type: String,
            enum: mediaTypes,
            default: "link",
          },
          url: {
            type: String,
            required: true,
            trim: true,
            maxlength: 800,
          },
        },
      ],
      default: [],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
      index: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    sharedPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NetworkingPost",
      default: null,
      index: true,
    },
    visibility: {
      type: String,
      enum: visibilityTypes,
      default: "public",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

networkingPostSchema.pre("validate", function requireContentOrAttachment() {
  const hasContent = Boolean(String(this.content ?? "").trim());
  const hasWork = Boolean(this.work?.title || this.work?.description || this.work?.url);
  const hasMedia = Array.isArray(this.media) && this.media.length > 0;
  const isShare = this.type === "share" && this.sharedPostId;

  if (!hasContent && !hasWork && !hasMedia && !isShare) {
    this.invalidate("content", "Post content, work details, media, or shared post is required");
  }
});

networkingPostSchema.index({ authorId: 1, createdAt: -1 });
networkingPostSchema.index({ createdAt: -1, visibility: 1 });
networkingPostSchema.index({ type: 1, createdAt: -1 });
networkingPostSchema.index(
  {
    content: "text",
    "work.description": "text",
    "work.title": "text",
  },
  {
    name: "networking_post_text",
    weights: {
      "work.title": 6,
      content: 5,
      "work.description": 3,
    },
  },
);

export const NetworkingPost = mongoose.model("NetworkingPost", networkingPostSchema);
