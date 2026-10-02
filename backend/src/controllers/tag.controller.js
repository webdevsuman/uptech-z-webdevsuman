import Tag from "../models/frontend/tag.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class TagController {
  
  async getTags(_req, res) {
    try {
      const tags = await Tag.find().sort({ name: 1 });
      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: tags,
      });
    } catch (error) {
      logger.error(`getTags error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  
  async getTagById(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.findById(id);

      if (!tag) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Tag not found",
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: tag,
      });
    } catch (error) {
      logger.error(`getTagById error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  
  async createTag(req, res) {
    try {
      const { name } = req.body;

      const existing = await Tag.findOne({ name });
      if (existing) {
        return res.status(httpStatusCodes.CONFLICT).json({
          success: false,
          message: "A tag with this name already exists.",
        });
      }

      const tag = await Tag.create({ name });

      return res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: "Tag created successfully",
        data: tag,
      });
    } catch (error) {
      logger.error(`createTag error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  
  async updateTag(req, res) {
    try {
      const { id } = req.params;
      const updatedTag = await Tag.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updatedTag) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Tag not found",
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Tag updated successfully",
        data: updatedTag,
      });
    } catch (error) {
      logger.error(`updateTag error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  
  async deleteTag(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByIdAndDelete(id);

      if (!tag) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Tag not found",
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Tag deleted successfully",
      });
    } catch (error) {
      logger.error(`deleteTag error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new TagController();
