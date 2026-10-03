import { z } from "zod";

export const createReviewSchema = z.object({
  courseId: z
    .string({ required_error: "Course ID is required" })
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID"),
  rating: z.coerce
    .number({ required_error: "Rating is required" })
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string({ required_error: "Review feedback is required" })
    .trim()
    .min(3, "Review comment must be at least 3 characters")
    .max(1000, "Review comment cannot exceed 1000 characters"),
});
