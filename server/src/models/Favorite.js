import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["provider", "service"],
      required: true,
      index: true,
    },
    userId: {
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

favoriteSchema.index(
  { userId: 1, targetType: 1, targetId: 1 },
  { unique: true },
);

export const Favorite = mongoose.model("Favorite", favoriteSchema);
