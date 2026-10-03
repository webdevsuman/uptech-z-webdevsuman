import mongoose from "mongoose";
import Enrollment from "../models/frontend/enrollment.model.js";
import Course from "../models/frontend/course.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class EnrollmentController {
  async enrollCourse(req, res) {
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

      // Check if user is the instructor of this course
      if (course.instructor.toString() === studentId.toString()) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Instructors cannot purchase or enroll in their own course",
        });
      }

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

      if (existingEnrollment) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "You are already enrolled in this course",
        });
      }

      const pricePaid =
        typeof course.price === "number"
          ? course.price
          : (course.price?.amount || 0);

      const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        pricePaid,
      });

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Successfully enrolled in course",
        data: enrollment,
      });
    } catch (error) {
      logger.error(`enrollCourse error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to enroll in course",
      });
    }
  }

  async checkEnrollmentStatus(req, res) {
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
      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          isEnrolled: !!enrollment,
          isInstructor,
        },
      });
    } catch (error) {
      logger.error(`checkEnrollmentStatus error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to check enrollment status",
      });
    }
  }

  async getMyEnrollments(req, res) {
    try {
      const studentId = req.user._id;
      const enrollments = await Enrollment.find({ student: studentId })
        .populate("course", "title thumbnail price rating reviewsCount")
        .sort({ createdAt: -1 });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      logger.error(`getMyEnrollments error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch user enrollments",
      });
    }
  }
}

export default new EnrollmentController();
