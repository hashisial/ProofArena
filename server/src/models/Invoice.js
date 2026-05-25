import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
      lowercase: true,
      trim: true,
    },
    stripeInvoiceId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      default: "draft",
      trim: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
