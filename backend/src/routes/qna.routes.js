import { Router } from "express";
import qnaController from "../controllers/qna.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import Validation from "../validators/index.js";
import {
  createQuestionSchema,
  createReplySchema,
} from "../validators/qna.validator.js";

const qnaRouter = Router();

// All Q&A endpoints require authentication (access restricted to enrolled students, instructor, or admin)
qnaRouter.use(authMiddleware);

// Get aggregated questions for instructor's courses
qnaRouter.get("/instructor", qnaController.getInstructorQuestions);

// Get questions for a course
qnaRouter.get("/course/:courseId", qnaController.getCourseQuestions);

// Post a new question
qnaRouter.post(
  "/",
  Validation.validate(createQuestionSchema),
  qnaController.askQuestion
);

// Reply to a question
qnaRouter.post(
  "/:questionId/reply",
  Validation.validate(createReplySchema),
  qnaController.replyToQuestion
);

// Delete a question
qnaRouter.delete("/:questionId", qnaController.deleteQuestion);

export default qnaRouter;
