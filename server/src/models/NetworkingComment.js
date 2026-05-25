import mongoose from "mongoose";

const networkingCommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NetworkingPost",
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
  },
  {
    timestamps: true,
  },
);

networkingCommentSchema.index({ postId: 1, createdAt: -1 });
networkingCommentSchema.index({ authorId: 1, createdAt: -1 });

export const NetworkingComment = mongoose.model(
  "NetworkingComment",
  networkingCommentSchema,
);
