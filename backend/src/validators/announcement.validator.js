import { z } from "zod";

export const createAnnouncementSchema = z.object({
  courseId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  content: z
    .string()
    .trim()
    .min(5, "Content must be at least 5 characters")
    .max(5000, "Content cannot exceed 5000 characters"),
});

export const updateAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters")
    .optional(),
  content: z
    .string()
    .trim()
    .min(5, "Content must be at least 5 characters")
    .max(5000, "Content cannot exceed 5000 characters")
    .optional(),
});
