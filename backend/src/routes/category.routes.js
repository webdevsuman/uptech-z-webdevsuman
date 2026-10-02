import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

const categoryRouter = Router();

// Public: anyone can view categories
categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:id", categoryController.getCategoryById);

// Admin / RBAC protected: management routes
categoryRouter.post(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.CATEGORY_MANAGE),
  Validation.validate(createCategorySchema),
  categoryController.createCategory
);

categoryRouter.patch(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.CATEGORY_MANAGE),
  Validation.validate(updateCategorySchema),
  categoryController.updateCategory
);

categoryRouter.delete(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.CATEGORY_MANAGE),
  categoryController.deleteCategory
);

export default categoryRouter;
