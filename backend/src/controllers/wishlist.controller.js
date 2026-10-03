import mongoose from "mongoose";
import Wishlist from "../models/frontend/wishlist.model.js";
import Course from "../models/frontend/course.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class WishlistController {
  async toggleWishlist(req, res) {
    try {
      const studentId = req.user._id;
      const { courseId } = req.body;

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid course ID is required",
        });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const existing = await Wishlist.findOne({
        student: studentId,
        course: courseId,
      });

      if (existing) {
        await Wishlist.deleteOne({ _id: existing._id });
        return res.status(httpStatusCodes.OK).json({
          success: true,
          message: "Course removed from wishlist",
          data: { isWishlisted: false },
        });
      } else {
        await Wishlist.create({
          student: studentId,
          course: courseId,
        });
        return res.status(httpStatusCodes.CREATED).json({
          success: true,
          message: "Course added to wishlist",
          data: { isWishlisted: true },
        });
      }
    } catch (error) {
      logger.error(`toggleWishlist error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to update wishlist",
      });
    }
  }

  async checkWishlistStatus(req, res) {
    try {
      const studentId = req.user._id;
      const { courseId } = req.params;

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid course ID is required",
        });
      }

      const existing = await Wishlist.findOne({
        student: studentId,
        course: courseId,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          isWishlisted: !!existing,
        },
      });
    } catch (error) {
      logger.error(`checkWishlistStatus error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to check wishlist status",
      });
    }
  }

  async getMyWishlist(req, res) {
    try {
      const studentId = req.user._id;
      const wishlist = await Wishlist.find({ student: studentId })
        .populate("course", "title thumbnail price rating reviewsCount instructor")
        .sort({ createdAt: -1 });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: wishlist,
      });
    } catch (error) {
      logger.error(`getMyWishlist error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch wishlist",
      });
    }
  }
}

export default new WishlistController();
