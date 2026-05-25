import { z } from "zod";
import {
  OFFER_AVAILABILITY_STATUS_VALUES,
  OFFER_DELIVERY_TYPE_VALUES,
  OFFER_PRICE_TYPE_VALUES,
  OUTCOME_OFFER_VISIBILITY_VALUES,
  PROOF_TYPE_VALUES,
} from "../constants/index.js";

const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid outcome offer id");
const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]{3,32}$/, "Invalid username");
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid offer slug")
  .max(120);

const optionalString = (max) => z.string().trim().max(max).optional().or(z.literal(""));
const requiredString = (min, max, label) =>
  z.string().trim().min(min, `${label} is required`).max(max);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.number().optional());

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

const targetOutcomeSchema = z
  .object({
    metricName: requiredString(1, 120, "Outcome metric name"),
    outcomeStatement: requiredString(1, 500, "Outcome statement"),
    targetValue: requiredString(1, 120, "Outcome target value"),
    unit: optionalString(50),
  })
  .strict();

const successCriteriaSchema = z
  .object({
    description: optionalString(500),
    required: z.boolean().optional().default(true),
    title: requiredString(1, 120, "Success criterion title"),
  })
  .strict();

const proofIncludedSchema = z
  .object({
    description: optionalString(500),
    proofType: z.enum(PROOF_TYPE_VALUES),
    required: z.boolean().optional().default(true),
    title: requiredString(1, 120, "Proof title"),
  })
  .strict();

const deliveryTimelineSchema = z
  .object({
    customLabel: optionalString(120),
    days: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    maxDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    minDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    type: z.enum(OFFER_DELIVERY_TYPE_VALUES).optional(),
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
        message: "Maximum delivery days must be greater than or equal to minimum delivery days",
        path: ["maxDays"],
      });
    }
  });

const priceRangeSchema = z
  .object({
    currency: z.string().trim().max(10).optional().default("USD"),
    customLabel: optionalString(120),
    max: optionalNumber.pipe(z.number().min(0).optional()),
    min: optionalNumber.pipe(z.number().min(0).optional()),
    type: z.enum(OFFER_PRICE_TYPE_VALUES).optional(),
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

const milestoneTemplateSchema = z
  .object({
    description: optionalString(500),
    expectedDueDay: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    order: z.coerce.number().int().min(0).optional().default(0),
    proofRequired: z.boolean().optional().default(false),
    title: requiredString(1, 120, "Milestone title"),
  })
  .strict();

const availabilitySchema = z
  .object({
    capacityPerMonth: optionalNumber.pipe(z.number().int().min(0).max(50).optional()),
    note: optionalString(300),
    status: z.enum(OFFER_AVAILABILITY_STATUS_VALUES).optional(),
  })
  .strict();

const editableOfferShape = {
  availability: availabilitySchema.optional(),
  category: requiredString(1, 80, "Category").optional(),
  deliveryTimeline: deliveryTimelineSchema.optional(),
  description: requiredString(1, 3000, "Description").optional(),
  industries: uniqueCleanList(20, 80),
  milestoneTemplate: z.array(milestoneTemplateSchema).max(20).optional(),
  priceRange: priceRangeSchema.optional(),
  proofIncluded: z.array(proofIncludedSchema).min(1).max(20).optional(),
  shortSummary: requiredString(1, 280, "Short summary").optional(),
  skills: uniqueCleanList(30, 50),
  subCategory: optionalString(80),
  successCriteria: z.array(successCriteriaSchema).min(1).max(20).optional(),
  tags: uniqueCleanList(20, 50),
  targetClient: optionalString(120),
  targetOutcome: targetOutcomeSchema.optional(),
  title: requiredString(8, 140, "Title").optional(),
  tools: uniqueCleanList(30, 50),
  visibility: z.enum(OUTCOME_OFFER_VISIBILITY_VALUES).optional(),
};

export const createOutcomeOfferSchema = z
  .object({
    ...editableOfferShape,
    category: requiredString(1, 80, "Category"),
    description: requiredString(1, 3000, "Description"),
    proofIncluded: z.array(proofIncludedSchema).min(1).max(20),
    shortSummary: requiredString(1, 280, "Short summary"),
    successCriteria: z.array(successCriteriaSchema).min(1).max(20),
    targetOutcome: targetOutcomeSchema,
    title: requiredString(8, 140, "Title"),
  })
  .strict();

export const updateOutcomeOfferSchema = z
  .object(editableOfferShape)
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one outcome offer field is required",
  });

export const offerIdParamSchema = z.object({
  offerId: objectIdSchema,
});

export const offerSlugParamSchema = z.object({
  slug: slugSchema,
  username: usernameSchema,
});

export const publicOfferSearchQuerySchema = z
  .object({
    availability: z.enum(OFFER_AVAILABILITY_STATUS_VALUES).optional(),
    category: z.string().trim().max(80).optional(),
    currency: z.string().trim().max(10).optional(),
    industry: z.string().trim().max(80).optional(),
    limit: z.coerce.number().int().positive().max(50).default(12),
    maxPrice: z.coerce.number().min(0).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    page: z.coerce.number().int().positive().default(1),
    q: z.string().trim().max(100).optional(),
    skill: z.string().trim().max(80).optional(),
    sort: z
      .enum([
        "newest",
        "relevance",
        "price_low",
        "price_high",
        "quality_score",
        "most_viewed",
      ])
      .optional()
      .default("newest"),
    tool: z.string().trim().max(80).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.maxPrice < value.minPrice
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum price must be greater than or equal to minimum price",
        path: ["maxPrice"],
      });
    }
  });
