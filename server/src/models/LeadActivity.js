import mongoose from "mongoose";

const leadActivitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["email_sent", "status_changed", "note_added", "imported"],
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

leadActivitySchema.index({ leadId: 1, createdAt: -1 });
leadActivitySchema.index({ userId: 1, createdAt: -1 });
leadActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });

export const LeadActivity = mongoose.model("LeadActivity", leadActivitySchema);
