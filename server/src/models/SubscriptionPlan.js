import mongoose from "mongoose";
import { PLAN_ORDER } from "../constants/subscriptionPlans.js";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: PLAN_ORDER,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    monthlyPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    leadLimit: {
      type: Number,
      default: null,
      min: 0,
    },
    scrapeLimitMonthly: {
      type: Number,
      default: null,
      min: 0,
    },
    scrapeLimitDaily: {
      type: Number,
      default: null,
      min: 0,
    },
    apiLimitMonthly: {
      type: Number,
      default: null,
      min: 0,
    },
    emailLimitMonthly: {
      type: Number,
      default: null,
      min: 0,
    },
    stripePriceId: {
      type: String,
      default: "",
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    advancedTools: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 99,
    },
  },
  {
    timestamps: true,
  },
);

subscriptionPlanSchema.index({ isActive: 1, sortOrder: 1 });

export const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
