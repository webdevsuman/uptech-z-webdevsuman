import rateLimit from "express-rate-limit";
import httpStatusCodes from "../utils/httpStatusCodes.js";

// General rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 requests per IP per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: httpStatusCodes.TOO_MANY_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Stricter rate limiter specifically for sending/resending OTP emails
export const otpResendRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow maximum 5 OTP resends per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: httpStatusCodes.TOO_MANY_REQUESTS,
  message: {
    success: false,
    message: "Too many OTP resend attempts. Please wait 15 minutes before requesting again.",
  },
});
