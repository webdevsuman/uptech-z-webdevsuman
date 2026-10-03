import { Router } from "express";
import reviewController from "../controllers/review.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import { createReviewSchema } from "../validators/review.validator.js";

const reviewRouter = Router();

// Admin: Get all reviews across platform with moderation filters
reviewRouter.get(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.REVIEW_MODERATE),
  reviewController.getAllReviewsAdmin
);

// Admin: Delete/moderate a review
reviewRouter.delete(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.REVIEW_MODERATE),
  reviewController.deleteReviewAdmin
);

// Public: Get reviews and rating stats for a course
reviewRouter.get("/course/:courseId", reviewController.getCourseReviews);

// Protected: Get logged-in student's reviews
reviewRouter.get("/my", authMiddleware, reviewController.getMyReviews);

// Protected: Check if current logged in user can review
reviewRouter.get(
  "/eligibility/:courseId",
  authMiddleware,
  reviewController.checkReviewEligibility
);

// Protected: Add or update review
reviewRouter.post(
  "/",
  authMiddleware,
  Validation.validate(createReviewSchema),
  reviewController.createOrUpdateReview
);

export default reviewRouter;
