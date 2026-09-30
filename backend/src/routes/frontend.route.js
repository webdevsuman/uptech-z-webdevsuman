import { Router } from "express";
import homeController from "../controllers/home.controller.js";
import checkPermission from "../middlewares/permission.middleware.js";
import PERMISSIONS from "../constants/permissions.constant.js";
import Validation from "../validators/index.js";
import createHomeAssetsSchema from "../validators/homepage.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const frontendRouter = Router();

frontendRouter.get("/homepage", homeController.getHomeAssets);
frontendRouter.post(
  "/homepage", authMiddleware,
  Validation.validate(createHomeAssetsSchema),
  checkPermission(PERMISSIONS.HOME_ASSETS_CREATE),
  homeController.createHomeAssets,
);

export default frontendRouter;
