import { Router } from "express";
import courseController from "../controllers/course.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.validator.js";
import {
  uploadImage,
  uploadToCloudinaryMiddleware,
} from "../middlewares/upload.middleware.js";

const courseRouter = Router();

// Instructor: list my courses
courseRouter.get(
  "/instructor",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_CREATE),
  courseController.getInstructorCourses
);

// Step 1: Create Course Draft (RBAC + Zod validation)
courseRouter.post(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_CREATE),
  Validation.validate(createCourseSchema),
  courseController.createCourse
);

// Step 2: Get single course details
courseRouter.get(
  "/:id",
  authMiddleware,
  courseController.getCourseById
);

// Step 2: Update course details / landing page
courseRouter.patch(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.COURSE_UPDATE),
  uploadImage.single("thumbnail"),
  uploadToCloudinaryMiddleware("courses"),
  Validation.validate(updateCourseSchema),
  courseController.updateCourse
);

export default courseRouter;
