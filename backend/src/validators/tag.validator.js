import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string({ required_error: "Tag name is required" })
    .trim()
    .min(2, "Tag name must be at least 2 characters")
    .max(30, "Tag name cannot exceed 30 characters"),
});

export const updateTagSchema = z.object({
  name: z.string().trim().min(2).max(30).optional(),
});
