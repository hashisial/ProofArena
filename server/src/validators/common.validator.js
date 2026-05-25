import mongoose from "mongoose";
import { z } from "zod";

export const mongoIdParamSchema = z.object({
  id: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid resource ID",
  }),
});

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  page: z.coerce.number().int().positive().default(1),
  sort: z.string().optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(2, "Slug must be at least 2 characters"),
});
