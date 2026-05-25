import { z } from "zod";
import {
  EXECUTION_PLAN_STATUS_VALUES,
  PLAN_CAN_START_VALUES,
  PLAN_PRICE_TYPE_VALUES,
  PLAN_TIMELINE_TYPE_VALUES,
  PLAN_UPDATE_FREQUENCY_VALUES,
  PROOF_TYPE_VALUES,
} from "../constants/index.js";

const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid id");
const optionalString = (max) => z.string().trim().max(max).optional().or(z.literal(""));
const requiredString = (min, max, label) =>
  z.string().trim().min(min, `${label} is required`).max(max);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.number().optional());

const optionalDate = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.date().optional());

function uniqueCleanList(maxItems, maxLength) {
  return z
    .array(z.string().trim().max(maxLength))
    .max(maxItems)
    .optional()
    .transform((items) => {
      if (items === undefined) {
        return undefined;
      }

      return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
    });
}

const timelineSchema = z
  .object({
    customLabel: optionalString(120),
    days: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    maxDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    minDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    type: z.enum(PLAN_TIMELINE_TYPE_VALUES),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.type === "range_days" &&
      value.minDays !== undefined &&
      value.maxDays !== undefined &&
      value.maxDays < value.minDays
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum timeline days must be greater than or equal to minimum timeline days",
        path: ["maxDays"],
      });
    }
  });

const priceSchema = z
  .object({
    currency: z.string().trim().max(10).optional().default("USD"),
    customLabel: optionalString(120),
    max: optionalNumber.pipe(z.number().min(0).optional()),
    min: optionalNumber.pipe(z.number().min(0).optional()),
    type: z.enum(PLAN_PRICE_TYPE_VALUES),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.type === "range" &&
      value.min !== undefined &&
      value.max !== undefined &&
      value.max < value.min
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum price must be greater than or equal to minimum price",
        path: ["max"],
      });
    }
  });

const milestoneSchema = z
  .object({
    deliverable: optionalString(300),
    description: optionalString(700),
    expectedDueDay: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    order: z.coerce.number().int().min(0).optional().default(0),
    proofPlanned: z.boolean().optional().default(false),
    title: requiredString(1, 120, "Milestone title"),
  })
  .strict();

const proofPlanSchema = z
  .object({
    description: optionalString(700),
    proofType: z.enum(PROOF_TYPE_VALUES),
    relatedMilestoneOrder: optionalNumber.pipe(z.number().int().min(0).optional()),
    required: z.boolean().optional().default(true),
    title: requiredString(1, 120, "Proof plan title"),
  })
  .strict();

const riskHandlingSchema = z
  .object({
    mitigation: requiredString(1, 500, "Risk mitigation"),
    risk: requiredString(1, 200, "Risk"),
  })
  .strict();

const communicationPlanSchema = z
  .object({
    channels: uniqueCleanList(10, 50),
    note: optionalString(300),
    updateFrequency: z.enum(PLAN_UPDATE_FREQUENCY_VALUES).optional(),
  })
  .strict();

const availabilitySchema = z
  .object({
    canStart: z.enum(PLAN_CAN_START_VALUES).optional(),
    customStartDate: optionalDate,
    hoursPerWeek: optionalNumber.pipe(z.number().int().min(1).max(80).optional()),
    note: optionalString(300),
  })
  .strict();

const attachmentSchema = z
  .object({
    note: optionalString(300),
    title: optionalString(120),
    type: z
      .enum(["portfolio", "case_study", "document", "live_url", "github", "proof_asset", "other"])
      .optional(),
    url: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .strict();

const editableExecutionPlanShape = {
  approach: requiredString(1, 4000, "Approach").optional(),
  attachments: z.array(attachmentSchema).max(10).optional(),
  availability: availabilitySchema.optional(),
  communicationPlan: communicationPlanSchema.optional(),
  milestones: z.array(milestoneSchema).min(1).max(20).optional(),
  price: priceSchema.optional(),
  proofPlan: z.array(proofPlanSchema).min(1).max(20).optional(),
  riskHandling: z.array(riskHandlingSchema).max(10).optional(),
  skills: uniqueCleanList(30, 50),
  summary: requiredString(1, 500, "Summary").optional(),
  timeline: timelineSchema.optional(),
  title: requiredString(8, 140, "Title").optional(),
  tools: uniqueCleanList(30, 50),
  whyThisProvider: optionalString(1500),
};

export const createExecutionPlanSchema = z
  .object({
    ...editableExecutionPlanShape,
    approach: requiredString(1, 4000, "Approach"),
    challengeId: objectIdSchema,
    milestones: z.array(milestoneSchema).min(1).max(20),
    outcomeOfferId: objectIdSchema.optional(),
    price: priceSchema,
    proofPlan: z.array(proofPlanSchema).min(1).max(20),
    summary: requiredString(1, 500, "Summary"),
    timeline: timelineSchema,
    title: requiredString(8, 140, "Title"),
  })
  .strict();

export const updateExecutionPlanSchema = z
  .object(editableExecutionPlanShape)
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one execution plan field is required",
  });

export const executionPlanIdParamSchema = z.object({
  planId: objectIdSchema,
});

export const executionPlanChallengeIdParamSchema = z.object({
  challengeId: objectIdSchema,
});

export const challengePlanQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().max(50).default(12),
    page: z.coerce.number().int().positive().default(1),
    sort: z.enum(["newest", "score", "price_low", "price_high"]).optional().default("newest"),
    status: z.enum(EXECUTION_PLAN_STATUS_VALUES).optional(),
  })
  .strict();

export const providerPlanQuerySchema = z
  .object({
    challengeId: objectIdSchema.optional(),
    limit: z.coerce.number().int().positive().max(50).default(12),
    page: z.coerce.number().int().positive().default(1),
    status: z.enum(EXECUTION_PLAN_STATUS_VALUES).optional(),
  })
  .strict();

export const clientDecisionSchema = z
  .object({
    note: optionalString(1000),
    rejectionReason: optionalString(1000),
  })
  .strict();
