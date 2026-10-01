import { z } from "zod";

export const homeAssetZodSchema = z.object({
  section: z
    .string()
    .trim()
    .min(1, "Section is required")
    .max(50, "Section name cannot exceed 50 characters"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required"),
});

export type THomeAssetFormData = z.infer<typeof homeAssetZodSchema>;
