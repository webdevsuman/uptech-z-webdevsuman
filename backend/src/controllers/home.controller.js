import Homepage from "../models/frontend/homepage.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class HomeController {
  async getHomeAssets(req, res) {
    try {
      const homeAssets = await Homepage.find();
      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: homeAssets,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createHomeAssets(req, res) {
    try {
      const { section, title, description } = req.body;
      if (!section || !title || !description) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "section, title and description are required.",
        });
      }

      const homeAsset = await Homepage.create({
        section,
        title,
        description,
      });
      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Home asset created.",
        data: homeAsset,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new HomeController();
