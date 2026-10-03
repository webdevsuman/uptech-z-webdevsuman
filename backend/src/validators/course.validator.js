import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string({ required_error: "Course title is required" })
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  category: z
    .string({ required_error: "Category is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
});

export const updateCourseSchema = z.object({
  title: z.string().trim().min(5).max(100).optional(),
  subtitle: z.string().trim().max(160).optional(),
  description: z.string().trim().min(20).optional(),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID")
    .optional(),
  level: z
    .enum(["beginner", "intermediate", "advanced", "all_levels"])
    .optional(),
  language: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative").optional(),
  status: z.enum(["draft", "under_review", "published", "rejected"]).optional(),
});

export const updateCourseStatusSchema = z.object({
  status: z.enum(["draft", "under_review", "published", "rejected"], {
    required_error: "Status is required",
  }),
});
