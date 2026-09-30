import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import Role from "../models/role.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendMail.js";
import {
  deleteOtpCache,
  getOtpCache,
  setOtpCache,
} from "../services/otpCache.service.js";
import { getOtpEmailTemplate } from "../templates/otpEmail.template.js";
import { generateOtp } from "../libs/otp.lib.js";
import jwt from "jsonwebtoken";
import { frontendUrl, jwtRefreshSecret, jwtSecret } from "../constants/constants.js";
import { getResetPasswordEmailTemplate } from "../templates/resetPasswordEmail.template.js";

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User with this email already exists. Login please.",
        });
      }
      const roleType = await Role.findOne({ name: role });
      if (!roleType) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid role. Please try again.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: roleType._id,
      });

      // Generate 4-digit OTP
      const otp = generateOtp();
      // Save OTP in Redis (5 min TTL)
      await setOtpCache(user._id.toString(), otp);

      // Send Email for verification
      await sendEmail({
        to: user.email,
        subject: "One Time Password For Verification",
        html: getOtpEmailTemplate(otp),
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: roleType.name,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async userVerification(req, res) {
    try {
      const { userId, otp } = req.body;

      const cachedOtp = await getOtpCache(userId);
      if (!cachedOtp) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "OTP has expired or is invalid. Please request a new one.",
        });
      }

      if (cachedOtp.toString() !== otp.toString()) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid OTP. Please check and try again.",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found.",
        });
      }

      if (user.isVerified) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User is already verified.",
        });
      }

      user.isVerified = true;
      await user.save();

      await deleteOtpCache(userId);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Account verified successfully. You can now log in.",
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resendOtp(req, res) {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found.",
        });
      }

      if (user.isVerified) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Account is already verified. Please log in.",
        });
      }

      const otp = generateOtp();

      await setOtpCache(user._id.toString(), otp);

      await sendEmail({
        to: user.email,
        subject: "Your New Verification Code - UpTech-Z",
        html: getOtpEmailTemplate(otp),
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const user = await User.findOne({ email }).populate("role", "name");
      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found.",
        });
      }

      if (!user.isVerified) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User is not verified. Please verify your account.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid Credentials. Please check and try again.",
        });
      }

      const jwtPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(jwtPayload, jwtSecret, {
        expiresIn: "1d",
      });
      const refreshToken = jwt.sign(jwtPayload, jwtRefreshSecret, {
        expiresIn: "7d",
      });

      if (!accessToken) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Access token not created",
        });
      } else if (!refreshToken) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Refresh token not created",
        });
      }

      const preHashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const hashedRefreshToken = await bcrypt.hash(preHashedRefreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await user.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          isVerified: user.isVerified,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      let decoded;

      try {
        decoded = jwt.verify(refreshToken, jwtRefreshSecret);
      } catch (error) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Refresh token is invalid or expired. Please log in again.",
        });
      }

      const user = await User.findById(decoded.id).populate("role", "name");
      if (!user) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "User not found.",
        });
      }

      if (!user.isActive) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      if (!user.refreshToken) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Session has been expired or revoked. Please log in again.",
        });
      }

      const preHashedToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const isTokenMatch = await bcrypt.compare(
        preHashedToken,
        user.refreshToken,
      );

      if (!isTokenMatch) {
        user.refreshToken = null;
        await user.save();

        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message:
            "Security alert: Token reuse detected. Session terminated. Please log in again.",
        });
      }

      const jwtPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = jwt.sign(jwtPayload, jwtSecret, {
        expiresIn: "1d",
      });
      const newRefreshToken = jwt.sign(jwtPayload, jwtRefreshSecret, {
        expiresIn: "7d",
      });

      const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

      user.refreshToken = await bcrypt.hash(hashedRefreshToken, 10);
      await user.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Token rotated successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      let userId = req.user?._id;

      if (!userId && req.body?.refreshToken) {
        const decoded = jwt.verify(req.body?.refreshToken, jwtRefreshSecret);
        userId = decoded.id;
      }

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          refreshToken: null,
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(httpStatusCodes.OK).json({
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      }

      const rawResetToken = crypto.randomBytes(32).toString("hex");

      const hashedResetToken = crypto
        .createHash("sha256")
        .update(rawResetToken)
        .digest("hex");

      user.resetToken = hashedResetToken;
      user.resetTokenExpiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await user.save();

      const resetUrl = `${frontendUrl}/reset-password?token=${rawResetToken}&id=${user._id}`;

      
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - UpTech-Z",
        html: getResetPasswordEmailTemplate(resetUrl),
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { userId, token, newPassword } = req.body;

      const hashedIncomingToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        _id: userId,
        resetToken: hashedIncomingToken,
        resetTokenExpiryTime: { $gt: new Date() },
      });

      if (!user) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Password reset token is invalid or has expired.",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiryTime = null;
      user.refreshToken = null; // Forces re-login on all devices
      await user.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message:
          "Password has been reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
