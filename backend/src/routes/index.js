import { Router } from "express";
import frontendRouter from "./frontend.route.js";
import authRouter from "./auth.routes.js";

const apiRouter = Router();

// Auth
apiRouter.use("/auth", authRouter);

// Frontend
apiRouter.use("/v2", frontendRouter);

//Admin

export default apiRouter;
