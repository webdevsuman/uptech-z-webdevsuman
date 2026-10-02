import { Router } from "express";
import tagController from "../controllers/tag.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import {
  createTagSchema,
  updateTagSchema,
} from "../validators/tag.validator.js";

const tagRouter = Router();

// Public: view tags
tagRouter.get("/", tagController.getTags);
tagRouter.get("/:id", tagController.getTagById);

// Admin / RBAC protected: management routes
tagRouter.post(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.TAGS_MANAGE),
  Validation.validate(createTagSchema),
  tagController.createTag,
);

tagRouter.patch(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.TAGS_MANAGE),
  Validation.validate(updateTagSchema),
  tagController.updateTag,
);

tagRouter.delete(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.TAGS_MANAGE),
  tagController.deleteTag,
);

export default tagRouter;
