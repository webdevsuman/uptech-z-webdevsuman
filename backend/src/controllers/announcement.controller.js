import mongoose from "mongoose";
import Announcement from "../models/frontend/announcement.model.js";
import Course from "../models/frontend/course.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class AnnouncementController {
  async getInstructorAnnouncements(req, res) {
    try {
      const instructorId = req.user._id;
      const { courseId } = req.query;

      const query = { instructor: instructorId };
      if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
        query.course = courseId;
      }

      const announcements = await Announcement.find(query)
        .populate("course", "title thumbnail")
        .sort({ createdAt: -1 });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      logger.error(`getInstructorAnnouncements error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch announcements",
      });
    }
  }

  // Public endpoint for homepage & public course notices
  async getPublicAnnouncements(req, res) {
    try {
      const { courseId, limit = 8 } = req.query;
      const query = {};
      if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
        query.course = courseId;
      }

      const announcements = await Announcement.find(query)
        .populate("course", "title thumbnail")
        .populate("instructor", "name profilePicture email")
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      logger.error(`getPublicAnnouncements error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch public announcements",
      });
    }
  }

  async createAnnouncement(req, res) {
    try {
      const instructorId = req.user._id;
      const { courseId, title, content } = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const courseInstructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      const isOwner = courseInstructorId === instructorId.toString();
      const isAdmin = req.user.role?.name === "super-admin";

      if (!isOwner && !isAdmin) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You can only post announcements for your own courses.",
        });
      }

      const announcement = await Announcement.create({
        instructor: instructorId,
        course: courseId,
        title: title.trim(),
        content: content.trim(),
      });

      await announcement.populate("course", "title thumbnail");

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Announcement broadcasted successfully",
        data: announcement,
      });
    } catch (error) {
      logger.error(`createAnnouncement error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to create announcement",
      });
    }
  }

  async updateAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Announcement not found",
        });
      }

      const isOwner =
        announcement.instructor.toString() === req.user._id.toString();
      const isAdmin = req.user.role?.name === "super-admin";

      if (!isOwner && !isAdmin) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not authorized to update this announcement.",
        });
      }

      if (title && title.trim()) announcement.title = title.trim();
      if (content && content.trim()) announcement.content = content.trim();

      await announcement.save();
      await announcement.populate("course", "title thumbnail");

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Announcement updated successfully",
        data: announcement,
      });
    } catch (error) {
      logger.error(`updateAnnouncement error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to update announcement",
      });
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params;

      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Announcement not found",
        });
      }

      const isOwner =
        announcement.instructor.toString() === req.user._id.toString();
      const isAdmin = req.user.role?.name === "super-admin";

      if (!isOwner && !isAdmin) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not authorized to delete this announcement.",
        });
      }

      await Announcement.findByIdAndDelete(id);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Announcement deleted successfully",
      });
    } catch (error) {
      logger.error(`deleteAnnouncement error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to delete announcement",
      });
    }
  }
}

export default new AnnouncementController();
