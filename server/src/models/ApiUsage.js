import mongoose from "mongoose";

const apiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    requestCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    planKey: {
      type: String,
      default: "free",
      trim: true,
      index: true,
    },
    lastMethod: {
      type: String,
      default: "",
      trim: true,
    },
    lastPath: {
      type: String,
      default: "",
      trim: true,
    },
    lastRequestAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

apiUsageSchema.index({ userId: 1, period: 1 }, { unique: true });
apiUsageSchema.index({ period: 1, requestCount: -1 });

export const ApiUsage = mongoose.model("ApiUsage", apiUsageSchema);
