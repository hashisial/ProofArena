import { z } from "zod";
import {
  STARTER_CHALLENGE_LEVEL_VALUES,
} from "../constants/index.js";

export const starterChallengeQuerySchema = z
  .object({
    category: z.string().trim().max(80).optional(),
    level: z.enum(STARTER_CHALLENGE_LEVEL_VALUES).optional(),
    limit: z.coerce.number().int().positive().max(50).default(12),
    maxBudget: z.coerce.number().min(0).optional(),
    minBudget: z.coerce.number().min(0).optional(),
    page: z.coerce.number().int().positive().default(1),
    q: z.string().trim().max(100).optional(),
    sort: z.enum(["newest", "level", "budget_low", "budget_high", "best_match"]).optional().default("level"),
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
