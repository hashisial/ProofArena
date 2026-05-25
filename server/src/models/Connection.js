import mongoose from "mongoose";

const connectionStatuses = ["pending", "accepted", "rejected", "blocked"];

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: connectionStatuses,
      default: "pending",
      index: true,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    pairKey: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

connectionSchema.virtual("requesterId").get(function getRequesterId() {
  return this.senderId;
});

connectionSchema.virtual("recipientId").get(function getRecipientId() {
  return this.receiverId;
});

connectionSchema.pre("validate", function normalizeConnection() {
  if (
    this.senderId &&
    this.receiverId &&
    this.senderId.toString() === this.receiverId.toString()
  ) {
    throw new Error("Users cannot connect with themselves");
  }

  if (this.senderId && this.receiverId) {
    this.pairKey = [this.senderId.toString(), this.receiverId.toString()]
      .sort()
      .join(":");
  }
});

connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
connectionSchema.index({ pairKey: 1 }, { unique: true, sparse: true });
connectionSchema.index({ receiverId: 1, status: 1, createdAt: -1 });
connectionSchema.index({ senderId: 1, status: 1, createdAt: -1 });
connectionSchema.index({ status: 1, updatedAt: -1 });

export const Connection = mongoose.model("Connection", connectionSchema);
