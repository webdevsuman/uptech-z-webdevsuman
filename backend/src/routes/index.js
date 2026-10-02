import { Router } from "express";
import frontendRouter from "./frontend.route.js";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import courseRouter from "./course.routes.js";

const apiRouter = Router();

// Auth
apiRouter.use("/auth", authRouter);

// Frontend
apiRouter.use("/v2", frontendRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/courses", courseRouter);

//Admin

export default apiRouter;
