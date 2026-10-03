import { z } from "zod";

export const createQuestionSchema = z.object({
  courseId: z
    .string({ required_error: "Course ID is required" })
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID"),
  title: z
    .string({ required_error: "Question title is required" })
    .trim()
    .min(3, "Question title must be at least 3 characters")
    .max(200, "Question title cannot exceed 200 characters"),
  content: z
    .string({ required_error: "Question details are required" })
    .trim()
    .min(5, "Question details must be at least 5 characters"),
});

export const createReplySchema = z.object({
  message: z
    .string({ required_error: "Reply message is required" })
    .trim()
    .min(1, "Reply message cannot be empty")
    .max(2000, "Reply message cannot exceed 2000 characters"),
});
