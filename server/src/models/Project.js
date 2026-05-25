import mongoose from "mongoose";

const projectStatuses = ["open", "in_progress", "completed", "cancelled"];

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    budget: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: projectStatuses,
      default: "open",
      index: true,
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ clientId: 1, status: 1, createdAt: -1 });
projectSchema.index({ providerId: 1, status: 1, createdAt: -1 });
projectSchema.index({ status: 1, deadline: 1 });
projectSchema.index({ budget: 1, status: 1 });

export const Project = mongoose.model("Project", projectSchema);
