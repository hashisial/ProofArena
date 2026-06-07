import { z } from "zod";
import {
  SAVED_PROVIDER_SOURCE_VALUES,
  SAVED_PROVIDER_STATUS_VALUES,
} from "../constants/index.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId");

const tagsSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(20)
  .optional();

export const saveProviderSchema = z
  .object({
    challengeId: objectIdSchema.optional().or(z.literal("")),
    note: z.string().trim().max(1000).optional().or(z.literal("")),
    providerId: objectIdSchema,
    source: z.enum(SAVED_PROVIDER_SOURCE_VALUES).optional(),
    tags: tagsSchema,
  })
  .strict()
  .transform((payload) => ({
    ...payload,
    challengeId: payload.challengeId || undefined,
  }));

export const updateSavedProviderSchema = z
  .object({
    note: z.string().trim().max(1000).optional().or(z.literal("")),
    status: z.enum(SAVED_PROVIDER_STATUS_VALUES).optional(),
    tags: tagsSchema,
  })
  .strict();

export const savedProviderIdParamSchema = z
  .object({
    savedProviderId: objectIdSchema,
  })
  .strict();

export const providerIdParamSchema = z
  .object({
    providerId: objectIdSchema,
  })
  .strict();

export const savedProviderQuerySchema = z
  .object({
    challengeId: objectIdSchema.optional().or(z.literal("")),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    page: z.coerce.number().int().min(1).optional(),
    q: z.string().trim().max(100).optional().or(z.literal("")),
    sort: z.enum(["newest", "oldest", "proof_score", "completed_outcomes"]).optional(),
    status: z.enum(SAVED_PROVIDER_STATUS_VALUES).optional().or(z.literal("")),
  })
  .strict()
  .transform((query) => ({
    ...query,
    challengeId: query.challengeId || undefined,
    status: query.status || undefined,
  }));
