import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import Validation from "../validators/index.js";
import {
  authRateLimiter,
  otpResendRateLimiter,
} from "../middlewares/rateLimiter.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  Validation.validate(registerSchema),
  authController.register,
);
authRouter.post(
  "/verify-otp",
  authRateLimiter,
  Validation.validate(verifyOtpSchema),
  authController.userVerification,
);
authRouter.post(
  "/resend-otp",
  otpResendRateLimiter,
  Validation.validate(resendOtpSchema),
  authController.resendOtp,
);
authRouter.post(
  "/login",
  authRateLimiter,
  Validation.validate(loginSchema),
  authController.login,
);
authRouter.post(
  "/refresh-token",
  authRateLimiter,
  Validation.validate(refreshTokenSchema),
  authController.refreshToken,
);

authRouter.post("/logout", authMiddleware, authController.logout);

authRouter.post("/forgot-password",otpResendRateLimiter, Validation.validate(forgotPasswordSchema), authController.forgotPassword);

authRouter.post(
  "/reset-password",
  authRateLimiter,
  Validation.validate(resetPasswordSchema),
  authController.resetPassword
);

export default authRouter;
