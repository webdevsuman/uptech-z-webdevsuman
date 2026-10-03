import { Router } from "express";
import courseController from "../controllers/course.controller.js";
import authMiddleware, {
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import {
  createCourseSchema,
  updateCourseSchema,
  updateCourseStatusSchema,
} from "../validators/course.validator.js";
import {
  uploadImage,
  uploadMedia,
  uploadToCloudinaryMiddleware,
} from "../middlewares/upload.middleware.js";

const courseRouter = Router();

// ==========================================
// Public Course Routes
// ==========================================
courseRouter.get("/", courseController.getPublishedCourses);
courseRouter.get("/featured", courseController.getFeaturedCourses);
courseRouter.get("/trending", courseController.getTrendingCourses);

// ==========================================
// Instructor Protected Routes
// ==========================================

// 4. Instructor: list own courses
courseRouter.get(
  "/instructor",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_CREATE),
  courseController.getInstructorCourses,
);

// 4.1 Admin: list all courses (draft, review, published, rejected)
courseRouter.get(
  "/admin",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_READ_ALL),
  courseController.getAdminCourses,
);

// 5. Step 1: Create Course Draft (RBAC + Zod validation)
courseRouter.post(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_CREATE),
  Validation.validate(createCourseSchema),
  courseController.createCourse,
);

// 6. Public Course Details (optional auth allows draft preview for owner/admin)
courseRouter.get(
  "/:id",
  optionalAuthMiddleware,
  courseController.getCourseById,
);

// 7. Step 2: Update course details / landing page
courseRouter.patch(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  uploadImage.single("thumbnail"),
  uploadToCloudinaryMiddleware("courses"),
  Validation.validate(updateCourseSchema),
  courseController.updateCourse,
);

// 8. Delete / Discard Course (Owner instructor or super-admin)
courseRouter.delete(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_DELETE),
  courseController.deleteCourse,
);

// ==========================================
// Curriculum & Syllabus Routes
// ==========================================

// Add section
courseRouter.post(
  "/:id/sections",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  courseController.addSection
);

// Update section
courseRouter.patch(
  "/:id/sections/:sectionId",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  courseController.updateSection
);

// Delete section
courseRouter.delete(
  "/:id/sections/:sectionId",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  courseController.deleteSection
);

// Add lecture to section
courseRouter.post(
  "/:id/sections/:sectionId/lectures",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  courseController.addLecture
);

// Update lecture & upload lecture video
courseRouter.patch(
  "/:id/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  checkPermission(PERMISSIONS.LECTURE_UPLOAD),
  uploadMedia.single("video"),
  uploadToCloudinaryMiddleware("lectures"),
  courseController.updateLecture
);

// Delete lecture
courseRouter.delete(
  "/:id/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  checkPermission(PERMISSIONS.LECTURE_DELETE),
  courseController.deleteLecture
);

// Add lecture PDF / material
courseRouter.post(
  "/:id/sections/:sectionId/lectures/:lectureId/resources",
  authMiddleware,
  checkPermission(PERMISSIONS.LECTURE_UPLOAD),
  uploadMedia.single("file"),
  uploadToCloudinaryMiddleware("materials"),
  courseController.addLectureResource
);

// Delete lecture material
courseRouter.delete(
  "/:id/sections/:sectionId/lectures/:lectureId/resources/:resourceId",
  authMiddleware,
  checkPermission(PERMISSIONS.LECTURE_DELETE),
  courseController.deleteLectureResource
);

// ==========================================
// Admin Feature & Trending Toggles
// ==========================================

// 8. Admin: Toggle isFeatured
courseRouter.patch(
  "/:id/featured",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  courseController.toggleFeatured,
);

// 9. Admin: Toggle isTrending
courseRouter.patch(
  "/:id/trending",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  courseController.toggleTrending,
);

// 10. Admin: Update course status (Approve, Reject, Draft, Review)
courseRouter.patch(
  "/:id/status",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_APPROVE),
  Validation.validate(updateCourseStatusSchema),
  courseController.updateCourseStatus,
);

export default courseRouter;
