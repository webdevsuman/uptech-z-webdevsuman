import Course from "../models/frontend/course.model.js";
import Category from "../models/frontend/category.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class CourseController {
  // 1. Step 1: Create initial draft (Input already sanitized by Zod)
  async createCourse(req, res) {
    try {
      const { title, category } = req.body;

      // Verify category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Selected category does not exist.",
        });
      }

      const newCourse = await Course.create({
        title,
        category,
        instructor: req.user._id,
        status: "draft",
      });

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Course draft created successfully",
        data: newCourse,
      });
    } catch (error) {
      logger.error(`createCourse error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to create course",
      });
    }
  }

  // 3. Get single course by ID for edit/manage
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id).populate("category", "name icon");

      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check ownership (or super-admin override)
      const isOwner = course.instructor.toString() === req.user._id.toString();
      const isAdmin = req.user.role?.name === "super-admin";
      if (!isOwner && !isAdmin) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not authorized to view or edit this course.",
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: course,
      });
    } catch (error) {
      logger.error(`getCourseById error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 4. Step 2: Incrementally update course details
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const isOwner = course.instructor.toString() === req.user._id.toString();
      const isAdmin = req.user.role?.name === "super-admin";
      if (!isOwner && !isAdmin) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not authorized to modify this course.",
        });
      }

      const updateData = { ...req.body };

      // Attach Cloudinary image details if uploaded via memory stream
      if (req.file?.cloudinary) {
        updateData.thumbnail = {
          url: req.file.cloudinary.secure_url,
          public_id: req.file.cloudinary.public_id,
        };
      }

      const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("category", "name icon");

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      logger.error(`updateCourse error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to update course",
      });
    }
  }

  // 5. Get list of courses created by the logged-in instructor
  async getInstructorCourses(req, res) {
    try {
      const courses = await Course.find({ instructor: req.user._id })
        .populate("category", "name icon")
        .sort({ createdAt: -1 });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      logger.error(`getInstructorCourses error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CourseController();
