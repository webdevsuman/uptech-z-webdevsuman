import { Router } from "express";
import reviewController from "../controllers/review.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import Validation from "../validators/index.js";
import { createReviewSchema } from "../validators/review.validator.js";

const reviewRouter = Router();

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
