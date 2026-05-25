import mongoose from "mongoose";

export const notificationEventTypes = [
  "new_message",
  "new_proposal",
  "connection_request",
  "connection_accepted",
  "service_update",
  "admin_update",
  "project_update",
  "payment_update",
  "campaign_update",
  "system_update",
];

export const notificationTypes = [
  "billing",
  "campaign",
  "connection",
  "connection_request",
  "connection_accepted",
  "message",
  "payment",
  "project",
  "proposal",
  "admin",
  "service_update",
  "system",
];

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    type: {
      type: String,
      enum: notificationTypes,
      default: "system",
      index: true,
    },
    eventType: {
      type: String,
      enum: notificationEventTypes,
      default: "system_update",
      index: true,
    },
    entityType: {
      type: String,
      enum: ["campaign", "connection", "conversation", "invoice", "message", "payment", "project", "proposal", "service", "subscription", "system"],
      default: "system",
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    actionUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
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

notificationSchema.virtual("isRead").get(function getIsRead() {
  return this.read;
});

notificationSchema.virtual("isRead").set(function setIsRead(value) {
  this.read = Boolean(value);
});

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, eventType: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, entityType: 1, entityId: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
