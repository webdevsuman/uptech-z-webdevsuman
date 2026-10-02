import { z } from "zod";

export const courseLandingPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  subtitle: z
    .string()
    .trim()
    .max(160, "Subtitle cannot exceed 160 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long")
    .optional()
    .or(z.literal("")),
  category: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid category"),
  level: z.enum(["all_levels", "beginner", "intermediate", "advanced"]),
  language: z.string().trim().min(1, "Language is required"),
});

export type CourseLandingPageFormData = z.infer<typeof courseLandingPageSchema>;
