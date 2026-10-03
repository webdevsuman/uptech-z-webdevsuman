import { Router } from "express";
import enrollmentController from "../controllers/enrollment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const enrollmentRouter = Router();

// All enrollment operations require authentication
enrollmentRouter.use(authMiddleware);

enrollmentRouter.post("/", enrollmentController.enrollCourse);
enrollmentRouter.get("/status/:courseId", enrollmentController.checkEnrollmentStatus);
enrollmentRouter.get("/my", enrollmentController.getMyEnrollments);

export default enrollmentRouter;
