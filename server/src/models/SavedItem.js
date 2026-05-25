import mongoose from "mongoose";

const savedItemTypes = ["service", "provider"];

const savedItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: savedItemTypes,
      required: true,
      index: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
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

savedItemSchema.pre("validate", function validateSavedTarget() {
  if (this.itemType === "service" && !this.serviceId) {
    this.invalidate("serviceId", "Service id is required when saving a service");
  }

  if (this.itemType === "provider" && !this.providerId) {
    this.invalidate("providerId", "Provider id is required when saving a provider");
  }
});

savedItemSchema.index(
  { serviceId: 1, userId: 1 },
  {
    partialFilterExpression: { itemType: "service" },
    unique: true,
  },
);
savedItemSchema.index(
  { providerId: 1, userId: 1 },
  {
    partialFilterExpression: { itemType: "provider" },
    unique: true,
  },
);
savedItemSchema.index({ userId: 1, createdAt: -1 });

export const SavedItem = mongoose.model("SavedItem", savedItemSchema);
