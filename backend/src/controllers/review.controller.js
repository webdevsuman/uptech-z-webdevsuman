import mongoose from "mongoose";
import Review from "../models/frontend/review.model.js";
import Course from "../models/frontend/course.model.js";
import Enrollment from "../models/frontend/enrollment.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class ReviewController {
  // Public endpoint
  async getCourseReviews(req, res) {
    try {
      const { courseId } = req.params;

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid course ID is required",
        });
      }

      const reviews = await Review.find({ course: courseId })
        .populate("student", "name profilePicture email")
        .sort({ createdAt: -1 });

      const totalReviews = reviews.length;
      let sumRating = 0;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      reviews.forEach((rev) => {
        sumRating += rev.rating;
        const rounded = Math.round(rev.rating);
        if (distribution[rounded] !== undefined) {
          distribution[rounded] += 1;
        }
      });

      const avgRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 0;

      // Calculate percentages for each star rating
      const distributionPercentages = {
        5: totalReviews > 0 ? Math.round((distribution[5] / totalReviews) * 100) : 0,
        4: totalReviews > 0 ? Math.round((distribution[4] / totalReviews) * 100) : 0,
        3: totalReviews > 0 ? Math.round((distribution[3] / totalReviews) * 100) : 0,
        2: totalReviews > 0 ? Math.round((distribution[2] / totalReviews) * 100) : 0,
        1: totalReviews > 0 ? Math.round((distribution[1] / totalReviews) * 100) : 0,
      };

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          reviews,
          stats: {
            avgRating,
            totalReviews,
            distribution,
            distributionPercentages,
          },
        },
      });
    } catch (error) {
      logger.error(`getCourseReviews error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch course reviews",
      });
    }
  }

  // Check if current user is eligible to rate/review
  async checkReviewEligibility(req, res) {
    try {
      const studentId = req.user._id;
      const { courseId } = req.params;

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid course ID is required",
        });
      }

      const course = await Course.findById(courseId).select("instructor");
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const isInstructor = course.instructor.toString() === studentId.toString();
      const isEnrolled = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });
      const existingReview = await Review.findOne({
        student: studentId,
        course: courseId,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          canReview: !isInstructor && !!isEnrolled,
          isEnrolled: !!isEnrolled,
          isInstructor,
          existingReview: existingReview || null,
        },
      });
    } catch (error) {
      logger.error(`checkReviewEligibility error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to check review eligibility",
      });
    }
  }

  // Create or update review - requires authentication & enrollment
  async createOrUpdateReview(req, res) {
    try {
      const studentId = req.user._id;
      const { courseId, rating, comment } = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check instructor restriction
      if (course.instructor.toString() === studentId.toString()) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Instructors cannot rate or review their own course",
        });
      }

      // Check enrollment requirement
      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

      if (!enrollment) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You must purchase and enroll in this course before leaving a review",
        });
      }

      // Upsert the review
      const review = await Review.findOneAndUpdate(
        { student: studentId, course: courseId },
        { rating, comment },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      ).populate("student", "name profilePicture email");

      // Recalculate Course aggregate rating and count
      const stats = await Review.aggregate([
        { $match: { course: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: "$course",
            avgRating: { $avg: "$rating" },
            total: { $sum: 1 },
          },
        },
      ]);

      const updatedRating = stats[0] ? Number(stats[0].avgRating.toFixed(1)) : 0;
      const updatedReviewsCount = stats[0] ? stats[0].total : 0;

      await Course.findByIdAndUpdate(courseId, {
        rating: updatedRating,
        reviewsCount: updatedReviewsCount,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Review submitted successfully",
        data: {
          review,
          courseStats: {
            rating: updatedRating,
            reviewsCount: updatedReviewsCount,
          },
        },
      });
    } catch (error) {
      logger.error(`createOrUpdateReview error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to submit review",
      });
    }
  }

  async getMyReviews(req, res) {
    try {
      const studentId = req.user._id;
      const reviews = await Review.find({ student: studentId })
        .populate("course", "title thumbnail price rating")
        .sort({ createdAt: -1 });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      logger.error(`getMyReviews error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch student reviews",
      });
    }
  }
}

export default new ReviewController();
