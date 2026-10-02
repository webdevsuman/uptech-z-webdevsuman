import Course from "../models/frontend/course.model.js";
import Category from "../models/frontend/category.model.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class CourseController {
  // 1. Public: List published courses with filters, search, sorting and pagination
  async getPublishedCourses(req, res) {
    try {
      const {
        search,
        category,
        level,
        price,
        sort = "newest",
        page = 1,
        limit = 12,
      } = req.query;

      const query = { status: "published" };

      if (search) {
        const searchRegex = new RegExp(search.trim(), "i");
        query.$or = [{ title: searchRegex }, { subtitle: searchRegex }];
      }

      if (category) {
        query.category = category;
      }

      if (level && level !== "All") {
        query.level = level;
      }

      if (price === "free") {
        query.price = 0;
      } else if (price === "paid") {
        query.price = { $gt: 0 };
      }

      let sortOptions = { createdAt: -1 };
      if (sort === "popular" || sort === "trending") {
        sortOptions = { isTrending: -1, viewsCount: -1, createdAt: -1 };
      } else if (sort === "price-low" || sort === "price-asc") {
        sortOptions = { price: 1 };
      } else if (sort === "price-high" || sort === "price-desc") {
        sortOptions = { price: -1 };
      } else if (sort === "newest") {
        sortOptions = { createdAt: -1 };
      }

      const pageNumber = Math.max(1, parseInt(page, 10) || 1);
      const limitNumber = Math.max(1, parseInt(limit, 10) || 12);
      const skip = (pageNumber - 1) * limitNumber;

      const [courses, total] = await Promise.all([
        Course.find(query)
          .populate("category", "name icon")
          .populate("instructor", "name email")
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNumber),
        Course.countDocuments(query),
      ]);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: courses,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      });
    } catch (error) {
      logger.error(`getPublishedCourses error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch published courses",
      });
    }
  }

  // 2. Public: Get featured courses
  async getFeaturedCourses(req, res) {
    try {
      const limitNumber = req.query.limit ? parseInt(req.query.limit, 10) : 10;
      const courses = await Course.find({
        status: "published",
        isFeatured: true,
      })
        .populate("category", "name icon")
        .populate("instructor", "name email")
        .sort({ updatedAt: -1 })
        .limit(limitNumber);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      logger.error(`getFeaturedCourses error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch featured courses",
      });
    }
  }

  // 3. Public: Get trending courses (Hybrid: isTrending: true first, then highest viewsCount)
  async getTrendingCourses(req, res) {
    try {
      const limitNumber = req.query.limit ? parseInt(req.query.limit, 10) : 10;
      const courses = await Course.find({
        status: "published",
      })
        .populate("category", "name icon")
        .populate("instructor", "name email")
        .sort({ isTrending: -1, viewsCount: -1, createdAt: -1 })
        .limit(limitNumber);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      logger.error(`getTrendingCourses error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch trending courses",
      });
    }
  }

  // 4. Get single course by ID (Public for published courses, protected for drafts)
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id)
        .populate("category", "name icon")
        .populate("instructor", "name email");

      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      // If course is published, it's public. Increment view count.
      if (course.status === "published") {
        course.viewsCount = (course.viewsCount || 0) + 1;
        await course.save();

        return res.status(httpStatusCodes.OK).json({
          success: true,
          data: course,
        });
      }

      // If draft or under_review, require authenticated user who is owner or super-admin
      if (!req.user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId = course.instructor?._id?.toString() || course.instructor?.toString();
      const isOwner = instructorId === req.user._id.toString();
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

  // 5. Instructor: Create initial draft (Input already sanitized by Zod)
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

  // 6. Instructor / Admin: Incrementally update course details
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

      const instructorId = course.instructor?._id?.toString() || course.instructor?.toString();
      const isOwner = instructorId === req.user._id.toString();
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

  // 7. Instructor: Get list of courses created by the logged-in instructor
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

  // 8. Admin: Toggle isFeatured
  async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const nextVal =
        typeof req.body?.isFeatured === "boolean"
          ? req.body.isFeatured
          : !course.isFeatured;

      course.isFeatured = nextVal;
      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: `Course ${nextVal ? "marked as featured" : "removed from featured"} successfully`,
        data: { id: course._id, isFeatured: course.isFeatured },
      });
    } catch (error) {
      logger.error(`toggleFeatured error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to toggle featured status",
      });
    }
  }

  // 9. Admin: Toggle isTrending
  async toggleTrending(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const nextVal =
        typeof req.body?.isTrending === "boolean"
          ? req.body.isTrending
          : !course.isTrending;

      course.isTrending = nextVal;
      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: `Course ${nextVal ? "marked as trending" : "removed from trending"} successfully`,
        data: { id: course._id, isTrending: course.isTrending },
      });
    } catch (error) {
      logger.error(`toggleTrending error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to toggle trending status",
      });
    }
  }

  // 10. Instructor / Admin: Delete / Discard a course
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      const isOwner = instructorId === req.user._id.toString();
      const isAdmin = req.user.role?.name === "super-admin";
      if (!isOwner && !isAdmin) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not authorized to delete this course.",
        });
      }

      // Cleanup Cloudinary thumbnail if exists
      if (course.thumbnail?.public_id) {
        try {
          await deleteFromCloudinary(course.thumbnail.public_id, "image");
        } catch (cloudErr) {
          logger.warn(
            `Failed to delete course thumbnail from Cloudinary: ${cloudErr.message}`
          );
        }
      }

      await Course.findByIdAndDelete(id);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      logger.error(`deleteCourse error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to delete course",
      });
    }
  }

  // ==========================================
  // Curriculum & Syllabus Methods
  // ==========================================

  // 11. Add a new section to course syllabus
  async addSection(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title || !title.trim()) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Section title is required",
        });
      }

      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      course.sections.push({
        title: title.trim(),
        order: course.sections.length + 1,
        lectures: [],
      });

      await course.save();

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Section added successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`addSection error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to add section",
      });
    }
  }

  // 12. Update section title
  async updateSection(req, res) {
    try {
      const { id, sectionId } = req.params;
      const { title } = req.body;

      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      if (title && title.trim()) {
        section.title = title.trim();
      }

      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Section updated successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`updateSection error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to update section",
      });
    }
  }

  // 13. Delete section
  async deleteSection(req, res) {
    try {
      const { id, sectionId } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      // Cleanup videos and resources from Cloudinary
      for (const lecture of section.lectures) {
        if (lecture.video?.public_id) {
          try {
            await deleteFromCloudinary(lecture.video.public_id, "video");
          } catch (e) {
            logger.warn(`Failed to delete lecture video: ${e.message}`);
          }
        }
        for (const resItem of lecture.resources) {
          if (resItem.public_id) {
            try {
              await deleteFromCloudinary(resItem.public_id, "raw");
            } catch (e) {
              logger.warn(`Failed to delete lecture resource: ${e.message}`);
            }
          }
        }
      }

      course.sections.pull(sectionId);
      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Section deleted successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`deleteSection error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to delete section",
      });
    }
  }

  // 14. Add lecture to section
  async addLecture(req, res) {
    try {
      const { id, sectionId } = req.params;
      const { title, isPreview } = req.body;

      if (!title || !title.trim()) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Lecture title is required",
        });
      }

      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      section.lectures.push({
        title: title.trim(),
        order: section.lectures.length + 1,
        isPreview: isPreview === true || isPreview === "true",
        video: { url: "", public_id: "", duration: 0 },
        resources: [],
      });

      await course.save();

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Lecture added successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`addLecture error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to add lecture",
      });
    }
  }

  // 15. Update lecture details / Upload lecture video
  async updateLecture(req, res) {
    try {
      const { id, sectionId, lectureId } = req.params;
      const { title, description, isPreview } = req.body;

      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      const lecture = section.lectures.id(lectureId);
      if (!lecture) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Lecture not found",
        });
      }

      if (title && title.trim()) lecture.title = title.trim();
      if (description !== undefined) lecture.description = description.trim();
      if (isPreview !== undefined) {
        lecture.isPreview = isPreview === true || isPreview === "true";
      }

      // If video file was uploaded
      if (req.file?.cloudinary) {
        // Delete old video if replaced
        if (lecture.video?.public_id) {
          try {
            await deleteFromCloudinary(lecture.video.public_id, "video");
          } catch (e) {
            logger.warn(`Failed to delete old video: ${e.message}`);
          }
        }
        lecture.video = {
          url: req.file.cloudinary.secure_url,
          public_id: req.file.cloudinary.public_id,
          duration: Math.round(req.file.cloudinary.duration || 0),
        };
      }

      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Lecture updated successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`updateLecture error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to update lecture",
      });
    }
  }

  // 16. Delete lecture
  async deleteLecture(req, res) {
    try {
      const { id, sectionId, lectureId } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      const lecture = section.lectures.id(lectureId);
      if (!lecture) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Lecture not found",
        });
      }

      // Cleanup video and resources
      if (lecture.video?.public_id) {
        try {
          await deleteFromCloudinary(lecture.video.public_id, "video");
        } catch (e) {
          logger.warn(`Failed to delete video: ${e.message}`);
        }
      }
      for (const resItem of lecture.resources) {
        if (resItem.public_id) {
          try {
            await deleteFromCloudinary(resItem.public_id, "raw");
          } catch (e) {
            logger.warn(`Failed to delete resource: ${e.message}`);
          }
        }
      }

      section.lectures.pull(lectureId);
      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Lecture deleted successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`deleteLecture error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to delete lecture",
      });
    }
  }

  // 17. Add PDF / Document material to lecture
  async addLectureResource(req, res) {
    try {
      const { id, sectionId, lectureId } = req.params;
      const { title } = req.body;

      if (!req.file?.cloudinary) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Document or PDF file is required",
        });
      }

      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      const lecture = section.lectures.id(lectureId);
      if (!lecture) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Lecture not found",
        });
      }

      const fileExtension = req.file.originalname.split(".").pop()?.toLowerCase() || "pdf";

      lecture.resources.push({
        title: (title && title.trim()) || req.file.originalname,
        url: req.file.cloudinary.secure_url,
        public_id: req.file.cloudinary.public_id,
        fileType: fileExtension,
        fileSize: req.file.size,
      });

      await course.save();

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Material uploaded successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`addLectureResource error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to add material",
      });
    }
  }

  // 18. Delete lecture material
  async deleteLectureResource(req, res) {
    try {
      const { id, sectionId, lectureId, resourceId } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const instructorId =
        course.instructor?._id?.toString() || course.instructor?.toString();
      if (instructorId !== req.user._id.toString() && req.user.role?.name !== "super-admin") {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized to modify this course",
        });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Section not found",
        });
      }

      const lecture = section.lectures.id(lectureId);
      if (!lecture) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Lecture not found",
        });
      }

      const resource = lecture.resources.id(resourceId);
      if (resource?.public_id) {
        try {
          await deleteFromCloudinary(resource.public_id, "raw");
        } catch (e) {
          logger.warn(`Failed to delete resource: ${e.message}`);
        }
      }

      lecture.resources.pull(resourceId);
      await course.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Material deleted successfully",
        data: course.sections,
      });
    } catch (error) {
      logger.error(`deleteLectureResource error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to delete material",
      });
    }
  }
}

export default new CourseController();
