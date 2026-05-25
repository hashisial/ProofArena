import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

followSchema.pre("validate", function normalizeFollow() {
  if (
    this.followerId &&
    this.followingId &&
    this.followerId.toString() === this.followingId.toString()
  ) {
    throw new Error("Users cannot follow themselves");
  }
});

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
followSchema.index({ followingId: 1, createdAt: -1 });

export const Follow = mongoose.model("Follow", followSchema);
