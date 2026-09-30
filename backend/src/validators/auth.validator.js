import { z } from "zod";
import ROLES from "../constants/roles.constant.js";
import regex from "../constants/regex.js";

// Only student and instructor can self-register
const allowedRegisterRoles = [ROLES.STUDENT, ROLES.INSTRUCTOR];

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .regex(
      regex.password,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
  role: z.enum(allowedRegisterRoles, {
    errorMap: () => ({
      message: `Role must be either '${ROLES.STUDENT}' or '${ROLES.INSTRUCTOR}'`,
    }),
  }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .regex(
      regex.password,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
});

export const verifyOtpSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain numbers only"),
});

export const resendOtpSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1,"Refresh token cannot be empty"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .email(),
});
export const resetPasswordSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  token: z
    .string({ required_error: "Reset token is required" })
    .min(32, "Invalid reset token"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8, "Password must be at least 8 characters long")
    .regex(
      regex.password,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});
