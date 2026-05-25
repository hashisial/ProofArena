import mongoose from "mongoose";

export const marketplaceTransactionStatuses = [
  "checkout_created",
  "payment_pending",
  "paid",
  "in_progress",
  "completed",
  "release_pending",
  "released",
  "failed",
  "cancelled",
  "refunded",
];

const marketplaceTransactionSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    amount: {
      type: Number,
      required: true,
      min: 50,
    },
    currency: {
      type: String,
      default: "usd",
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      index: true,
    },
    commissionBps: {
      type: Number,
      required: true,
      min: 0,
      max: 10_000,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },
    providerAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: marketplaceTransactionStatuses,
      default: "checkout_created",
      index: true,
    },
    stripeCheckoutSessionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripeChargeId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripeConnectedAccountId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripeTransferId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    transferGroup: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
      index: true,
    },
    workCompletedAt: {
      type: Date,
      default: null,
      index: true,
    },
    releasedAt: {
      type: Date,
      default: null,
      index: true,
    },
    failureReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
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

marketplaceTransactionSchema.index({ clientId: 1, status: 1, createdAt: -1 });
marketplaceTransactionSchema.index({ providerId: 1, status: 1, createdAt: -1 });
marketplaceTransactionSchema.index({ projectId: 1, status: 1 });
marketplaceTransactionSchema.index({ status: 1, createdAt: -1 });

export const MarketplaceTransaction = mongoose.model(
  "MarketplaceTransaction",
  marketplaceTransactionSchema,
);
