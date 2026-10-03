import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .trim()
    .min(3, "Review comment must be at least 3 characters")
    .max(1000, "Review comment cannot exceed 1000 characters"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
