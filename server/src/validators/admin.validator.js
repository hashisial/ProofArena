import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId");

export const adminListQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(50).optional(),
    moderationStatus: z
      .enum(["approved", "pending", "rejected", "flagged"])
      .optional()
      .or(z.literal("")),
    page: z.coerce.number().int().min(1).optional(),
    q: z.string().trim().max(100).optional().or(z.literal("")),
    role: z.enum(["admin", "client", "provider"]).optional().or(z.literal("")),
    sort: z.enum(["newest", "oldest", "name", "status"]).optional().or(z.literal("")),
    status: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .strict();

export const adminModerationSchema = z
  .object({
    reason: z.string().trim().max(1000).optional().or(z.literal("")),
    status: z.enum(["approved", "pending", "rejected", "flagged"]),
  })
  .strict();

export const adminUserStatusSchema = z
  .object({
    status: z.enum(["active", "pending", "suspended"]),
  })
  .strict();

export const adminUserIdParamSchema = z.object({
  userId: objectIdSchema,
});

export const adminProviderIdParamSchema = z.object({
  providerId: objectIdSchema,
});

export const adminChallengeIdParamSchema = z.object({
  challengeId: objectIdSchema,
});

export const adminOfferIdParamSchema = z.object({
  offerId: objectIdSchema,
});

export const adminProofAssetIdParamSchema = z.object({
  assetId: objectIdSchema,
});
