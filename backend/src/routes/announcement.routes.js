import { Router } from "express";
import announcementController from "../controllers/announcement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../validators/announcement.validator.js";

const announcementRouter = Router();

// All announcement endpoints require authentication and instructor permissions
announcementRouter.use(authMiddleware);
announcementRouter.use(checkPermission(PERMISSIONS.COURSE_UPDATE));

announcementRouter.get("/", announcementController.getInstructorAnnouncements);

announcementRouter.post(
  "/",
  Validation.validate(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

announcementRouter.patch(
  "/:id",
  Validation.validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement,
);

announcementRouter.delete("/:id", announcementController.deleteAnnouncement);

export default announcementRouter;
