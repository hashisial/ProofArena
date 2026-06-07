import { z } from "zod";
import {
  LOST_REASON_VALUES,
  OPPORTUNITY_PRIORITY_VALUES,
  OPPORTUNITY_SOURCE_VALUES,
  OPPORTUNITY_STAGE,
  OPPORTUNITY_STAGE_VALUES,
} from "../constants/index.js";

const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid id");
const optionalString = (max) => z.string().trim().max(max).optional().or(z.literal(""));

const valueSchema = z
  .object({
    amount: z.coerce.number().min(0).optional(),
    currency: z.string().trim().max(10).optional(),
    type: z.enum(["fixed", "range", "hourly", "milestone", "unknown"]).optional(),
  })
  .strict()
  .optional();

const nextActionSchema = z
  .object({
    completed: z.boolean().optional(),
    completedAt: z.coerce.date().optional().nullable(),
    description: optionalString(500),
    dueAt: z.coerce.date().optional().nullable(),
    title: optionalString(160),
  })
  .strict()
  .optional();

export const updateNextActionSchema = z
  .object({
    completed: z.boolean().optional(),
    completedAt: z.coerce.date().optional().nullable(),
    description: optionalString(500),
    dueAt: z.coerce.date().optional().nullable(),
    title: optionalString(160),
  })
  .strict();

const noteSchema = z
  .object({
    body: z.string().trim().min(1, "Note body is required").max(1000),
  })
  .strict();

const tagsSchema = z
  .array(z.string().trim().max(50))
  .max(20)
  .optional()
  .transform((tags) => {
    if (tags === undefined) return undefined;
    return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
  });

export const createOpportunitySchema = z
  .object({
    challengeId: objectIdSchema.optional(),
    clientId: objectIdSchema.optional(),
    nextAction: nextActionSchema,
    notes: z.array(noteSchema).max(20).optional(),
    outcomeOfferId: objectIdSchema.optional(),
    priority: z.enum(OPPORTUNITY_PRIORITY_VALUES).optional(),
    source: z.enum(OPPORTUNITY_SOURCE_VALUES).optional(),
    stage: z.enum(OPPORTUNITY_STAGE_VALUES).optional(),
    summary: optionalString(700),
    tags: tagsSchema,
    title: z.string().trim().min(1, "Opportunity title is required").max(180),
    value: valueSchema,
  })
  .strict();

export const updateOpportunitySchema = z
  .object({
    nextAction: nextActionSchema,
    priority: z.enum(OPPORTUNITY_PRIORITY_VALUES).optional(),
    summary: optionalString(700),
    tags: tagsSchema,
    title: z.string().trim().min(1).max(180).optional(),
    value: valueSchema,
  })
  .strict();

export const updateOpportunityStageSchema = z
  .object({
    lostNote: optionalString(1000),
    lostReason: z.enum(LOST_REASON_VALUES).optional(),
    note: optionalString(1000),
    stage: z.enum(OPPORTUNITY_STAGE_VALUES),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.stage === OPPORTUNITY_STAGE.LOST && !value.lostReason) {
      context.addIssue({
        code: "custom",
        message: "Lost reason is required",
        path: ["lostReason"],
      });
    }
  });

export const addOpportunityNoteSchema = noteSchema;

export const completeNextActionSchema = z
  .object({
    completed: z.boolean(),
  })
  .strict();

export const opportunityIdParamSchema = z.object({
  opportunityId: objectIdSchema,
});

export const opportunityQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().max(50).default(50),
    page: z.coerce.number().int().positive().default(1),
    priority: z.enum(OPPORTUNITY_PRIORITY_VALUES).optional(),
    q: z.string().trim().max(100).optional().or(z.literal("")),
    sort: z.enum(["newest", "oldest", "last_activity", "priority", "value"]).optional().default("last_activity"),
    source: z.enum(OPPORTUNITY_SOURCE_VALUES).optional(),
    stage: z.enum(OPPORTUNITY_STAGE_VALUES).optional(),
  })
  .strict();
