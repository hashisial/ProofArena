import mongoose from "mongoose";

const proposalStatuses = ["pending", "accepted", "rejected", "withdrawn"];

const proposalSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    proposalText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    bidAmount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    estimatedDuration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: proposalStatuses,
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

proposalSchema.index({ projectId: 1, status: 1, createdAt: -1 });
proposalSchema.index({ providerId: 1, status: 1, createdAt: -1 });
proposalSchema.index({ providerId: 1, projectId: 1 }, { unique: true });

export const Proposal = mongoose.model("Proposal", proposalSchema);
