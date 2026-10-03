import { Router } from "express";
import analyticsController from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";

const analyticsRouter = Router();

analyticsRouter.use(authMiddleware);

analyticsRouter.get(
  "/dashboard",
  checkPermission(PERMISSIONS.ANALYTICS_PLATFORM),
  analyticsController.getAdminDashboardAnalytics
);

export default analyticsRouter;
