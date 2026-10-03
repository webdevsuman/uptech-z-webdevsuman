import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must not exceed 60 characters"),
  qualification: z
    .string()
    .trim()
    .max(120, "Headline / qualification cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(1500, "Bio cannot exceed 1500 characters")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
