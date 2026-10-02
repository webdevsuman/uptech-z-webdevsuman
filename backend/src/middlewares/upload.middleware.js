import multer from "multer";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import { uploadStreamToCloudinary } from "../config/cloudinary.js";
import { allowedImageTypes, MAX_IMAGE_SIZE, MAX_MEDIA_SIZE } from "../constants/constants.js";

// Store files directly in memory buffer (no local disk writes)
const storage = multer.memoryStorage();

const imageFileFilter = (_req, file, cb) => {
  if (allowedImageTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, JPEG, WEBP, and SVG image files are allowed!"));
  }
};

/**
 * Multer middleware for standard image uploads (5MB max)
 */
export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE
  },
});

/**
 * Multer middleware for larger media or attachments (images, PDFs, videos up to 100MB)
 */
export const uploadMedia = multer({
  storage,
  limits: {
    fileSize: MAX_MEDIA_SIZE
  },
});

/**
 * Express middleware factory to upload in-memory Multer file(s) to Cloudinary.
 * Structure: uptechz/{moduleName}/{userId}
 *
 * Attaches the Cloudinary result object to req.file.cloudinary (for single file)
 * or to each file in req.files (for multiple files).
 *
 * @param {string} moduleName - Module name (e.g. 'users', 'courses', 'lectures')
 * @returns {import('express').RequestHandler}
 */
export const uploadToCloudinaryMiddleware = (moduleName = "common") => {
  return async (req, res, next) => {
    try {
      const hasSingleFile = Boolean(req.file);
      const hasMultipleFiles = Boolean(
        req.files &&
          (Array.isArray(req.files)
            ? req.files.length > 0
            : Object.keys(req.files).length > 0)
      );

      // If no file was uploaded in this request, proceed to next middleware
      if (!hasSingleFile && !hasMultipleFiles) {
        return next();
      }

      // Resolve user ID safely from auth middleware (or fallback to 'common' for public routes)
      const userId =
        req.user?._id?.toString() || req.user?.id?.toString() || "common";
      const targetFolder = `uptechz/${moduleName}/${userId}`;

      // Handle single file upload (e.g., uploadImage.single('avatar'))
      if (hasSingleFile) {
        const result = await uploadStreamToCloudinary(req.file.buffer, {
          folder: targetFolder,
          resource_type: "auto",
        });
        req.file.cloudinary = result;
      }

      // Handle multiple files upload (e.g., uploadImage.array('photos') or upload.fields([...]))
      if (hasMultipleFiles) {
        if (Array.isArray(req.files)) {
          const uploadPromises = req.files.map(async (file) => {
            const result = await uploadStreamToCloudinary(file.buffer, {
              folder: targetFolder,
              resource_type: "auto",
            });
            file.cloudinary = result;
            return result;
          });
          req.cloudinaryFiles = await Promise.all(uploadPromises);
        } else if (typeof req.files === "object") {
          const fieldKeys = Object.keys(req.files);
          for (const key of fieldKeys) {
            const filesInField = req.files[key];
            const uploadPromises = filesInField.map(async (file) => {
              const result = await uploadStreamToCloudinary(file.buffer, {
                folder: targetFolder,
                resource_type: "auto",
              });
              file.cloudinary = result;
              return result;
            });
            await Promise.all(uploadPromises);
          }
        }
      }

      return next();
    } catch (error) {
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to upload file to Cloudinary",
        errors: [error.message],
      });
    }
  };
};

export default uploadImage;

