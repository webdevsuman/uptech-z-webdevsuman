import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get("/", notificationController.getAdminNotifications);
notificationRouter.patch("/:id/read", notificationController.markAsRead);
notificationRouter.patch("/read-all", notificationController.markAllAsRead);
notificationRouter.delete("/clear-all", notificationController.deleteAllNotifications);
notificationRouter.delete("/:id", notificationController.deleteNotification);

export default notificationRouter;
