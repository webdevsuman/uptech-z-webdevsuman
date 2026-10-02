import { z } from "zod";

export const tagZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name must be at least 2 characters")
    .max(30, "Tag name cannot exceed 30 characters"),
});

export type TTagFormData = z.infer<typeof tagZodSchema>;
