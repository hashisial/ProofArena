import { z } from "zod";
import {
  CHALLENGE_TIMELINE_TYPE_VALUES,
  CHALLENGE_URGENCY_VALUES,
  CLIENT_CHALLENGE_BUDGET_TYPE_VALUES,
  CLIENT_CHALLENGE_VISIBILITY_VALUES,
  PROOF_SIMPLICITY_VALUES,
  PROOF_TYPE_VALUES,
  STARTER_CHALLENGE_LEVEL_VALUES,
} from "../constants/index.js";

const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid challenge id");
const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]{3,32}$/, "Invalid username");
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid challenge slug")
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

const targetOutcomeSchema = z
  .object({
    metricName: requiredString(1, 120, "Outcome metric name"),
    outcomeStatement: requiredString(1, 700, "Outcome statement"),
    targetValue: requiredString(1, 120, "Outcome target value"),
    unit: optionalString(50),
  })
  .strict();

const successCriteriaSchema = z
  .object({
    description: optionalString(700),
    required: z.boolean().optional().default(true),
    title: requiredString(1, 120, "Success criterion title"),
  })
  .strict();

const proofRequirementSchema = z
  .object({
    description: optionalString(700),
    proofType: z.enum(PROOF_TYPE_VALUES),
    required: z.boolean().optional().default(true),
    title: requiredString(1, 120, "Proof requirement title"),
  })
  .strict();

const timelineSchema = z
  .object({
    customLabel: optionalString(120),
    durationDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    endDate: optionalDate,
    maxDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    minDays: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    startDate: optionalDate,
    type: z.enum(CHALLENGE_TIMELINE_TYPE_VALUES).optional(),
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

    if (value.startDate && value.endDate && value.endDate < value.startDate) {
      context.addIssue({
        code: "custom",
        message: "Timeline end date must be after start date",
        path: ["endDate"],
      });
    }
  });

const budgetSchema = z
  .object({
    currency: z.string().trim().max(10).optional().default("USD"),
    customLabel: optionalString(120),
    max: optionalNumber.pipe(z.number().min(0).optional()),
    min: optionalNumber.pipe(z.number().min(0).optional()),
    type: z.enum(CLIENT_CHALLENGE_BUDGET_TYPE_VALUES).optional(),
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
        message: "Maximum budget must be greater than or equal to minimum budget",
        path: ["max"],
      });
    }
  });

const milestoneTemplateSchema = z
  .object({
    description: optionalString(700),
    expectedDueDay: optionalNumber.pipe(z.number().int().min(1).max(365).optional()),
    order: z.coerce.number().int().min(0).optional().default(0),
    proofRequired: z.boolean().optional().default(false),
    title: requiredString(1, 120, "Milestone title"),
  })
  .strict();

const locationSchema = z
  .object({
    city: optionalString(80),
    country: optionalString(80),
    remote: z.boolean().optional().default(true),
    timezone: optionalString(80),
  })
  .strict();

const clientIntentSchema = z
  .object({
    budgetConfirmed: z.boolean().optional().default(false),
    decisionMakerConfirmed: z.boolean().optional().default(false),
    hiringUrgency: z.enum(["exploring", "this_week", "this_month", "flexible"]).optional(),
    responseExpectation: optionalString(120),
  })
  .strict();

const starterChallengeSchema = z
  .object({
    enabled: z.boolean().optional().default(false),
    estimatedHours: optionalNumber.pipe(z.number().int().min(1).max(80).optional()),
    level: z.enum(STARTER_CHALLENGE_LEVEL_VALUES).optional(),
    newProviderFriendly: z.boolean().optional().default(false),
    proofSimplicity: z.enum(PROOF_SIMPLICITY_VALUES).optional(),
    providerLimit: optionalNumber.pipe(z.number().int().min(1).max(50).optional()),
    recommendedForFirstClient: z.boolean().optional().default(false),
  })
  .strict();

const editableChallengeShape = {
  budget: budgetSchema.optional(),
  category: requiredString(1, 80, "Category").optional(),
  clientIntent: clientIntentSchema.optional(),
  description: requiredString(1, 5000, "Description").optional(),
  industries: uniqueCleanList(20, 80),
  industry: optionalString(80),
  location: locationSchema.optional(),
  milestoneTemplate: z.array(milestoneTemplateSchema).max(20).optional(),
  proofRequirements: z.array(proofRequirementSchema).min(1).max(20).optional(),
  shortSummary: requiredString(1, 280, "Short summary").optional(),
  skillsNeeded: uniqueCleanList(30, 50),
  starterChallenge: starterChallengeSchema.optional(),
  subCategory: optionalString(80),
  successCriteria: z.array(successCriteriaSchema).min(1).max(20).optional(),
  tags: uniqueCleanList(20, 50),
  targetOutcome: targetOutcomeSchema.optional(),
  targetProviderType: optionalString(120),
  timeline: timelineSchema.optional(),
  title: requiredString(8, 140, "Title").optional(),
  toolsNeeded: uniqueCleanList(30, 50),
  urgency: z.enum(CHALLENGE_URGENCY_VALUES).optional(),
  visibility: z.enum(CLIENT_CHALLENGE_VISIBILITY_VALUES).optional(),
};

export const createChallengeSchema = z
  .object({
    ...editableChallengeShape,
    category: requiredString(1, 80, "Category"),
    description: requiredString(1, 5000, "Description"),
    proofRequirements: z.array(proofRequirementSchema).min(1).max(20),
    shortSummary: requiredString(1, 280, "Short summary"),
    successCriteria: z.array(successCriteriaSchema).min(1).max(20),
    targetOutcome: targetOutcomeSchema,
    title: requiredString(8, 140, "Title"),
  })
  .strict();

export const updateChallengeSchema = z
  .object(editableChallengeShape)
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one challenge field is required",
  });

export const challengeIdParamSchema = z.object({
  challengeId: objectIdSchema,
});

export const challengeSlugParamSchema = z.object({
  slug: slugSchema,
  username: usernameSchema,
});

export const publicChallengeSearchQuerySchema = z
  .object({
    category: z.string().trim().max(80).optional(),
    currency: z.string().trim().max(10).optional(),
    industry: z.string().trim().max(80).optional(),
    limit: z.coerce.number().int().positive().max(50).default(12),
    maxBudget: z.coerce.number().min(0).optional(),
    minBudget: z.coerce.number().min(0).optional(),
    page: z.coerce.number().int().positive().default(1),
    q: z.string().trim().max(100).optional(),
    skill: z.string().trim().max(80).optional(),
    sort: z
      .enum([
        "newest",
        "relevance",
        "budget_low",
        "budget_high",
        "urgent",
        "most_plans",
        "quality_score",
      ])
      .optional()
      .default("newest"),
    status: z.enum(["open", "reviewing_plans"]).optional(),
    tool: z.string().trim().max(80).optional(),
    urgency: z.enum(CHALLENGE_URGENCY_VALUES).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.minBudget !== undefined &&
      value.maxBudget !== undefined &&
      value.maxBudget < value.minBudget
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum budget must be greater than or equal to minimum budget",
        path: ["maxBudget"],
      });
    }
  });
