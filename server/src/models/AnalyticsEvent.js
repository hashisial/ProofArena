import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    eventType: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    type: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    entityType: {
      type: String,
      enum: ["service", "provider", "category", "saved_item", "search", "page", "lead", ""],
      default: "",
      index: true,
    },
    entityId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    path: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    referrer: {
      type: String,
      trim: true,
      default: "",
    },
    userAgent: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

analyticsEventSchema.pre("validate", function syncAnalyticsEventType() {
  if (!this.eventType && this.type) {
    this.eventType = this.type;
  }

  if (!this.type && this.eventType) {
    this.type = this.eventType;
  }

  if (!this.type && !this.eventType) {
    this.type = "custom";
    this.eventType = "custom";
  }
});

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
analyticsEventSchema.index({ path: 1, createdAt: -1 });
analyticsEventSchema.index({ userId: 1, type: 1, createdAt: -1 });

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);
