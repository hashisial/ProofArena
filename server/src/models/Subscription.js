import mongoose from "mongoose";
import { PLAN_ORDER, PLAN_KEYS } from "../constants/subscriptionPlans.js";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: PLAN_ORDER,
      default: PLAN_KEYS.FREE,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "free",
        "active",
        "trialing",
        "past_due",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "unpaid",
      ],
      default: "free",
      index: true,
    },
    stripeCustomerId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripePriceId: {
      type: String,
      default: "",
      trim: true,
    },
    currentPeriodStart: {
      type: Date,
      default: null,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    usageLimits: {
      maxLeads: {
        type: Number,
        default: 25,
        min: 0,
      },
      maxScrapes: {
        type: Number,
        default: 3,
        min: 0,
      },
      maxEmails: {
        type: Number,
        default: 25,
        min: 0,
      },
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

subscriptionSchema.index({ plan: 1, status: 1 });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
