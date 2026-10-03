import mongoose from "mongoose";
import QnA from "../models/frontend/qna.model.js";
import Course from "../models/frontend/course.model.js";
import Enrollment from "../models/frontend/enrollment.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

/**
 * Helper to verify if a user has access to view/participate in course Q&A.
 * Access is granted to:
 * 1. The course instructor
 * 2. Platform admins
 * 3. Enrolled students
 */
const verifyCourseQnAAccess = async (userId, courseId, userRole) => {
  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return { allowed: false, status: httpStatusCodes.BAD_REQUEST, message: "Valid Course ID is required" };
  }

  const course = await Course.findById(courseId).select("instructor");
  if (!course) {
    return { allowed: false, status: httpStatusCodes.NOT_FOUND, message: "Course not found" };
  }

  const isInstructor = course.instructor.toString() === userId.toString();
  const isAdmin = userRole === "admin" || (typeof userRole === "object" && userRole?.name === "admin");

  if (isInstructor || isAdmin) {
    return { allowed: true, isInstructor: true, course };
  }

  const enrollment = await Enrollment.findOne({
    student: userId,
    course: courseId,
  });

  if (!enrollment) {
    return {
      allowed: false,
      status: httpStatusCodes.FORBIDDEN,
      message: "You must be enrolled in this course to view or participate in Q&A discussions",
    };
  }

  return { allowed: true, isInstructor: false, course };
};

class QnAController {
  async getCourseQuestions(req, res) {
    try {
      const { courseId } = req.params;
      const { search } = req.query;
      const userId = req.user._id;
      const userRole = req.user.role;

      const access = await verifyCourseQnAAccess(userId, courseId, userRole);
      if (!access.allowed) {
        return res.status(access.status).json({
          success: false,
          message: access.message,
        });
      }

      const filter = { course: courseId };
      if (search && typeof search === "string" && search.trim()) {
        const queryRegex = new RegExp(search.trim(), "i");
        filter.$or = [{ title: queryRegex }, { content: queryRegex }];
      }

      const questions = await QnA.find(filter)
        .populate("user", "name profilePicture email")
        .populate("answers.user", "name profilePicture email")
        .sort({ createdAt: -1 });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      logger.error("Error in getCourseQuestions:", error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch course questions",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/qna/instructor
   * Returns aggregated questions across all courses owned by the instructor
   */
  async getInstructorQuestions(req, res) {
    try {
      const instructorId = req.user._id;
      const { courseId, filter = "all", search, limit } = req.query;

      // 1. Get all courses taught by this instructor
      const courses = await Course.find({ instructor: instructorId }).select(
        "_id title thumbnail"
      );
      const courseIds = courses.map((c) => c._id);

      if (courseIds.length === 0) {
        return res.status(httpStatusCodes.OK).json({
          success: true,
          data: {
            questions: [],
            counts: { total: 0, unanswered: 0, answered: 0 },
          },
        });
      }

      // 2. Build match filter
      const query = {};

      if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
        query.course = courseId;
      } else {
        query.course = { $in: courseIds };
      }

      if (filter === "unanswered") {
        query.$or = [
          { answers: { $size: 0 } },
          { "answers.isInstructor": { $ne: true } },
        ];
      } else if (filter === "answered") {
        query["answers.isInstructor"] = true;
      }

      if (search && typeof search === "string" && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        const searchCondition = [{ title: regex }, { content: regex }];
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchCondition }];
          delete query.$or;
        } else {
          query.$or = searchCondition;
        }
      }

      let qnaQuery = QnA.find(query)
        .populate("course", "title thumbnail slug")
        .populate("user", "name profilePicture email")
        .populate("answers.user", "name profilePicture email")
        .sort({ createdAt: -1 });

      if (limit && !isNaN(Number(limit))) {
        qnaQuery = qnaQuery.limit(Number(limit));
      }

      const questions = await qnaQuery.exec();

      // 3. Aggregate summary counts for instructor
      const totalCount = await QnA.countDocuments({ course: { $in: courseIds } });
      const unansweredCount = await QnA.countDocuments({
        course: { $in: courseIds },
        $or: [
          { answers: { $size: 0 } },
          { "answers.isInstructor": { $ne: true } },
        ],
      });
      const answeredCount = Math.max(0, totalCount - unansweredCount);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          questions,
          counts: {
            total: totalCount,
            unanswered: unansweredCount,
            answered: answeredCount,
          },
        },
      });
    } catch (error) {
      logger.error("Error in getInstructorQuestions:", error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch instructor questions",
        error: error.message,
      });
    }
  }

  async askQuestion(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { courseId, title, content } = req.body;

      const access = await verifyCourseQnAAccess(userId, courseId, userRole);
      if (!access.allowed) {
        return res.status(access.status).json({
          success: false,
          message: access.message,
        });
      }

      const question = await QnA.create({
        course: courseId,
        user: userId,
        title,
        content,
        answers: [],
      });

      const populatedQuestion = await QnA.findById(question._id).populate(
        "user",
        "name profilePicture email"
      );

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Question posted successfully",
        data: populatedQuestion,
      });
    } catch (error) {
      logger.error("Error in askQuestion:", error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to post question",
        error: error.message,
      });
    }
  }


  async replyToQuestion(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { questionId } = req.params;
      const { message } = req.body;

      if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid Question ID is required",
        });
      }

      const question = await QnA.findById(questionId);
      if (!question) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Question not found",
        });
      }

      const access = await verifyCourseQnAAccess(userId, question.course, userRole);
      if (!access.allowed) {
        return res.status(access.status).json({
          success: false,
          message: access.message,
        });
      }

      question.answers.push({
        user: userId,
        message,
        isInstructor: access.isInstructor,
        createdAt: new Date(),
      });

      await question.save();

      const updatedQuestion = await QnA.findById(question._id)
        .populate("user", "name profilePicture email")
        .populate("answers.user", "name profilePicture email");

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Reply posted successfully",
        data: updatedQuestion,
      });
    } catch (error) {
      logger.error("Error in replyToQuestion:", error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to post reply",
        error: error.message,
      });
    }
  }

  
  async deleteQuestion(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { questionId } = req.params;

      if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid Question ID is required",
        });
      }

      const question = await QnA.findById(questionId);
      if (!question) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Question not found",
        });
      }

      const access = await verifyCourseQnAAccess(userId, question.course, userRole);
      const isAuthor = question.user.toString() === userId.toString();

      if (!isAuthor && !access.isInstructor) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not authorized to delete this question",
        });
      }

      await QnA.findByIdAndDelete(questionId);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error) {
      logger.error("Error in deleteQuestion:", error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete question",
        error: error.message,
      });
    }
  }
}

export default new QnAController();
