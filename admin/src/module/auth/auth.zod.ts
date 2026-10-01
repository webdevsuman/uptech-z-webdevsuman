// auth.zod.ts
import { z } from "zod";
import regex from "@/lib/regex";

export const loginZodSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(regex.email, "Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      regex.password,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    ),
});

export type TLoginFormData = z.infer<typeof loginZodSchema>;
