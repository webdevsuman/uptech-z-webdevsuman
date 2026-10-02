import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import {
  updateUserSchema,
  updateUserStatusSchema,
} from "../validators/user.validator.js";

const adminUserRouter = Router();

// All routes require auth
adminUserRouter.use(authMiddleware);

adminUserRouter.get(
  "/",
  checkPermission(PERMISSIONS.USER_READ),
  userController.getUsers,
);

adminUserRouter.get(
  "/:id",
  checkPermission(PERMISSIONS.USER_READ),
  userController.getUserById,
);

adminUserRouter.patch(
  "/:id",
  checkPermission(PERMISSIONS.USER_ASSIGN_ROLE),
  Validation.validate(updateUserSchema),
  userController.updateUser,
);

adminUserRouter.patch(
  "/:id/status",
  checkPermission(PERMISSIONS.USER_UPDATE_STATUS),
  Validation.validate(updateUserStatusSchema),
  userController.toggleStatus,
);

adminUserRouter.patch(
  "/:id/verify",
  checkPermission(PERMISSIONS.USER_UPDATE_STATUS),
  Validation.validate(updateUserStatusSchema),
  userController.verifyUser,
);

export default adminUserRouter;
