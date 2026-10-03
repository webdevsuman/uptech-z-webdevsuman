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

// 3. Self-service profile update
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must not exceed 60 characters")
    .optional(),
  qualification: z
    .string()
    .trim()
    .max(120, "Qualification / headline cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(1500, "Bio cannot exceed 1500 characters")
    .optional()
    .or(z.literal("")),
});
