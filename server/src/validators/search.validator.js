import { z } from "zod";

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

export const providerSearchQuerySchema = z
  .object({
    available: optionalBooleanQuery(),
    availability: z.enum(["available", "limited", "unavailable"]).optional().or(z.literal("")),
    categories: z.union([z.string().trim().max(240), z.array(z.string().trim().max(80))]).optional(),
    category: z.string().trim().max(80).optional().or(z.literal("")),
    location: z.string().trim().max(120).optional().or(z.literal("")),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    maxRate: z.coerce.number().min(0).optional(),
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
    skills: z.union([z.string().trim().max(240), z.array(z.string().trim().max(80))]).optional(),
    sort: z
      .enum([
        "relevance",
        "proof_score",
        "newest",
        "completed_outcomes",
        "rating",
        "rating_desc",
        "price_asc",
        "price_desc",
        "completed_desc",
      ])
      .optional()
      .or(z.literal("")),
    verified: optionalBooleanQuery(),
  })
  .strict();
