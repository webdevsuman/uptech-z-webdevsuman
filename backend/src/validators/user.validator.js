import { z } from "zod";

// 1. Update user profile / role assignment
export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50)
    .optional(),
  bio: z.string().max(500).optional(),
  qualification: z.string().max(200).optional(),
  role: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Role ID")
    .optional(),
});

// 2. Toggle active/inactive or verify
export const updateUserStatusSchema = z.object({
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});
