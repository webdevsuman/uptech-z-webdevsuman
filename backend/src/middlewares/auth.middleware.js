import jwt from "jsonwebtoken";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import { jwtSecret } from "../constants/constants.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-access-token"];

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader || req.query?.token || req.body?.token;

  if (!token) {
    return res.status(httpStatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Access token missing or invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id)
      .select("-password -refreshToken -resetToken")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          select: "name",
        },
      });
    if (!user) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }
    if (!user.isActive) {
      return res.status(httpStatusCodes.FORBIDDEN).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }
    if (!user.isVerified) {
      return res.status(httpStatusCodes.FORBIDDEN).json({
        success: false,
        message: "Account not verified. Please verify your email first.",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(httpStatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Token verification failed or expired",
      errors: [error.message],
    });
  }
};

//For course view counts by anonymous viewers
export const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-access-token"];

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader || req.query?.token || req.body?.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id)
      .select("-password -refreshToken -resetToken")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          select: "name",
        },
      });

    if (user && user.isActive && user.isVerified) {
      req.user = user;
    } else {
      req.user = null;
    }
  } catch (_error) {
    req.user = null;
  }

  return next();
};

export default authMiddleware;
