import { z } from "zod";

export const userEditZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  qualification: z
    .string()
    .max(200, "Qualification cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
  role: z.string().optional(),
});

export type TUserEditFormData = z.infer<typeof userEditZodSchema>;
