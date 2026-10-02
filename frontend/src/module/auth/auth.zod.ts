import { z } from "zod";
import regex from "@/utils/regex";

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

export const registerZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
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
  role: z.enum(["student", "instructor"], {
    message: "Please select whether you are a Student or Instructor",
  }),
});

export type TRegisterFormData = z.infer<typeof registerZodSchema>;

export const verifyOtpZodSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(regex.otp, "OTP must contain 6 numbers"),
});

export type TVerifyOtpFormData = z.infer<typeof verifyOtpZodSchema>;

export const forgotPasswordZodSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(regex.email, "Please enter a valid email address"),
});

export type TForgotPasswordFormData = z.infer<typeof forgotPasswordZodSchema>;

export const resetPasswordZodSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        regex.password,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
      ),
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TResetPasswordFormData = z.infer<typeof resetPasswordZodSchema>;
