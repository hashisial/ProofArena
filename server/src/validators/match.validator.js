import { z } from "zod";
import { MATCH_STATUS_VALUES } from "../constants/index.js";

const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid id");

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.number().optional());

export const matchQuerySchema = z
  .object({
    category: z.string().trim().max(80).optional().or(z.literal("")),
    limit: z.coerce.number().int().positive().max(50).default(12),
    minScore: optionalNumber.pipe(z.number().min(0).max(100).optional()),
    page: z.coerce.number().int().positive().default(1),
    sort: z.enum(["best", "newest", "category", "budget_fit"]).optional().default("best"),
    status: z.enum(MATCH_STATUS_VALUES).optional(),
  })
  .strict();

export const challengeRecommendedProvidersQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().max(50).default(12),
    minScore: optionalNumber.pipe(z.number().min(0).max(100).optional()),
    page: z.coerce.number().int().positive().default(1),
    sort: z.enum(["best", "newest", "proof_score", "availability"]).optional().default("best"),
    status: z.enum(MATCH_STATUS_VALUES).optional(),
  })
  .strict();

export const challengeIdParamSchema = z.object({
  challengeId: objectIdSchema,
});

export const matchIdParamSchema = z.object({
  matchId: objectIdSchema,
});

export const updateMatchStatusSchema = z
  .object({
    status: z.enum(["viewed", "saved", "ignored", "dismissed"]),
  })
  .strict();
