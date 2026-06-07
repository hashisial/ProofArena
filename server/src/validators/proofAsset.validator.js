import { z } from "zod";
import {
  PROOF_ASSET_TYPE_VALUES,
  PROOF_ASSET_VISIBILITY_VALUES,
  PROOF_SOURCE_TYPE,
  PROOF_SOURCE_TYPE_VALUES,
  PROOF_VERIFICATION_STATUS_VALUES,
} from "../constants/index.js";

const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid id");
const optionalString = (max) => z.string().trim().max(max).optional().or(z.literal(""));
const requiredString = (min, max, label) =>
  z.string().trim().min(min, `${label} is required`).max(max);

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

const linkSchema = z
  .object({
    label: optionalString(120),
    url: z.string().trim().url("Use a valid proof link URL").optional().or(z.literal("")),
  })
  .strict()
  .optional();

const textProofSchema = z
  .object({
    content: optionalString(5000),
  })
  .strict()
  .optional();

const contextSchema = z
  .object({
    challengeIds: z.array(objectIdSchema).max(50).optional(),
    executionPlanIds: z.array(objectIdSchema).max(50).optional(),
    outcomeOfferIds: z.array(objectIdSchema).max(50).optional(),
  })
  .strict()
  .optional();

const proofAssetPayloadSchema = z
  .object({
    assetType: z.enum(PROOF_ASSET_TYPE_VALUES).optional(),
    category: optionalString(80),
    description: optionalString(1500),
    link: linkSchema,
    linkedContexts: contextSchema,
    relatedIndustries: uniqueCleanList(20, 80),
    relatedSkills: uniqueCleanList(30, 50),
    relatedTools: uniqueCleanList(30, 50),
    sourceType: z.enum(PROOF_SOURCE_TYPE_VALUES).optional(),
    tags: uniqueCleanList(20, 50),
    textProof: textProofSchema,
    title: z.string().trim().min(3, "Proof asset title is required").max(140).optional(),
    visibility: z.enum(PROOF_ASSET_VISIBILITY_VALUES).optional(),
  })
  .strict();

function refineSourceRequirements(value, context) {
  if (value.sourceType === PROOF_SOURCE_TYPE.LINK && !value.link?.url) {
    context.addIssue({
      code: "custom",
      message: "Proof link URL is required",
      path: ["link", "url"],
    });
  }

  if (value.sourceType === PROOF_SOURCE_TYPE.TEXT && !value.textProof?.content) {
    context.addIssue({
      code: "custom",
      message: "Text proof content is required",
      path: ["textProof", "content"],
    });
  }
}

export const createProofAssetSchema = proofAssetPayloadSchema
  .extend({
    assetType: z.enum(PROOF_ASSET_TYPE_VALUES),
    sourceType: z.enum(PROOF_SOURCE_TYPE_VALUES),
    title: requiredString(3, 140, "Proof asset title"),
  })
  .superRefine(refineSourceRequirements);

export const updateProofAssetSchema = proofAssetPayloadSchema.superRefine(refineSourceRequirements);

export const proofAssetIdParamSchema = z.object({
  assetId: objectIdSchema,
});

export const proofAssetQuerySchema = z
  .object({
    assetType: z.enum(PROOF_ASSET_TYPE_VALUES).optional(),
    category: z.string().trim().max(80).optional().or(z.literal("")),
    limit: z.coerce.number().int().positive().max(50).default(12),
    page: z.coerce.number().int().positive().default(1),
    q: z.string().trim().max(100).optional().or(z.literal("")),
    skill: z.string().trim().max(80).optional().or(z.literal("")),
    sort: z.enum(["newest", "oldest", "title", "type", "verified"]).optional().default("newest"),
    sourceType: z.enum(PROOF_SOURCE_TYPE_VALUES).optional(),
    tag: z.string().trim().max(80).optional().or(z.literal("")),
    verificationStatus: z.enum(PROOF_VERIFICATION_STATUS_VALUES).optional(),
    visibility: z.enum(PROOF_ASSET_VISIBILITY_VALUES).optional(),
  })
  .strict();

export const proofAssetContextSchema = z
  .object({
    challengeId: objectIdSchema.optional(),
    executionPlanId: objectIdSchema.optional(),
    outcomeOfferId: objectIdSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.challengeId && !value.executionPlanId && !value.outcomeOfferId) {
      context.addIssue({
        code: "custom",
        message: "Attach context is required",
        path: ["context"],
      });
    }
  });
