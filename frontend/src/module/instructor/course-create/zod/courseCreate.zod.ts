import { z } from "zod";

export const courseCreateSchema = z.object({
  courseType: z.enum(["course", "practice"]).default("course"),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  category: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid category"),
});

export type CourseCreateFormData = z.infer<typeof courseCreateSchema>;
