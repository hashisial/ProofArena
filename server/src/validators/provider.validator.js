import { z } from "zod";
import { OFFER_AVAILABILITY_STATUS_VALUES } from "../constants/index.js";

const legacyAvailabilityValues = ["available", "limited", "unavailable"];

function optionalBooleanQuery() {
  return z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (typeof value === "boolean") {
      return value;
    }

    const normalized = String(value).trim().toLowerCase();

    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }

    return value;
  }, z.boolean().optional());
}

const commaListOrArray = z.union([
  z.string().trim().max(240),
  z.array(z.string().trim().max(80)),
]);
const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId");

function normalizeProviderIds(value) {
  const values = Array.isArray(value) ? value : [value];

  return Array.from(
    new Set(
      values
        .flatMap((item) => String(item ?? "").split(","))
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export const providerSearchQuerySchema = z
  .object({
    available: optionalBooleanQuery(),
    availability: z
      .enum([...legacyAvailabilityValues, ...OFFER_AVAILABILITY_STATUS_VALUES])
      .optional()
      .or(z.literal("")),
    categories: commaListOrArray.optional(),
    category: z.string().trim().max(80).optional().or(z.literal("")),
    hasOutcomeOffers: optionalBooleanQuery(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    location: z.string().trim().max(120).optional().or(z.literal("")),
    maxPrice: z.coerce.number().min(0).optional(),
    maxRate: z.coerce.number().min(0).optional(),
    minCompletedOutcomes: z.coerce.number().int().min(0).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    minProofScore: z.coerce.number().min(0).max(100).optional(),
    minRate: z.coerce.number().min(0).optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    page: z.coerce.number().int().min(1).optional(),
    q: z.string().trim().max(100).optional().or(z.literal("")),
    rating: z.coerce.number().min(0).max(5).optional(),
    role: z.enum(["provider", "client", "all"]).optional().or(z.literal("")),
    search: z.string().trim().max(100).optional().or(z.literal("")),
    skill: z.string().trim().max(80).optional().or(z.literal("")),
    skills: commaListOrArray.optional(),
    sort: z
      .enum([
        "relevance",
        "proof_score",
        "completed_outcomes",
        "newest",
        "availability",
        "rating",
        "rating_desc",
        "price_asc",
        "price_desc",
        "completed_desc",
        "name",
      ])
      .optional()
      .or(z.literal("")),
    tool: z.string().trim().max(80).optional().or(z.literal("")),
    tools: commaListOrArray.optional(),
    verified: optionalBooleanQuery(),
  })
  .strict();

export const providerCompareQuerySchema = z
  .object({
    "providerIds[]": z.union([z.string(), z.array(z.string())]).optional(),
    providerIds: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .strict()
  .transform((query) => ({
    providerIds: normalizeProviderIds(query.providerIds ?? query["providerIds[]"]),
  }))
  .pipe(
    z.object({
      providerIds: z
        .array(objectIdSchema)
        .min(1, "At least one provider id is required")
        .max(4, "Maximum 4 providers can be compared"),
    }),
  );
