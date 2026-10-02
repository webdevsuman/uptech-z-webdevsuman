import User from "../../models/user.model.js";
import Role from "../../models/role.model.js";
import httpStatusCodes from "../../utils/httpStatusCodes.js";
import logger from "../../utils/logger.js";
import ROLES from "../constants/roles.constant.js";

class UserController {
  // 1. View: List all users with pagination, search & filters
  async getUsers(req, res) {
    try {
      const {
        search = "",
        role = "",
        isActive,
        isVerified,
        page = 1,
        limit = 10,
      } = req.query;

      const query = {};

      // Search by name or email (exact or prefix match)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by isActive
      if (isActive !== undefined) {
        query.isActive = isActive === "true";
      }

      // Filter by isVerified
      if (isVerified !== undefined) {
        query.isVerified = isVerified === "true";
      }

      // Find super-admin role ID to ensure it is always excluded
      const superAdminRole = await Role.findOne({ name: ROLES.SUPER_ADMIN });

      // Role filter
      if (role && role !== ROLES.SUPER_ADMIN) {
        const roleDoc = await Role.findOne({ name: role });
        if (roleDoc) {
          query.role = roleDoc._id;
        }
      } else if (superAdminRole) {
        // Exclude super-admin accounts
        query.role = { $ne: superAdminRole._id };
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password -refreshToken -resetToken")
          .populate("role", "name")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        User.countDocuments(query),
      ]);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      logger.error(`getUsers error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 2. View: Get single user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
        .select("-password -refreshToken -resetToken")
        .populate("role", "name permissions");

      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      // Block access to super-admin account details
      if (user.role?.name === ROLES.SUPER_ADMIN) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Access to super-admin account is restricted.",
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error(`getUserById error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 3. Edit: Update user profile and/or assign role
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, bio, qualification, role } = req.body;

      // Prevent admin from accidentally demoting themselves
      if (id === req.user._id.toString() && role) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "You cannot change your own role.",
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (qualification !== undefined) updateData.qualification = qualification;

      if (role) {
        const roleExists = await Role.findById(role);
        if (!roleExists) {
          return res.status(httpStatusCodes.NOT_FOUND).json({
            success: false,
            message: "Selected role does not exist.",
          });
        }
        updateData.role = role;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      })
        .select("-password -refreshToken -resetToken")
        .populate("role", "name");

      if (!updatedUser) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      logger.error(`updateUser error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 4. Deactivate / Activate: Toggle isActive (Block/Unblock)
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      // Prevent deactivating own account
      if (id === req.user._id.toString()) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "You cannot deactivate your own account.",
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      // If explicit isActive boolean provided in body, use it; otherwise toggle
      user.isActive =
        req.body.isActive !== undefined ? req.body.isActive : !user.isActive;
      await user.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
        data: { id: user._id, isActive: user.isActive },
      });
    } catch (error) {
      logger.error(`toggleStatus error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 5. Verify: Mark email as verified / unverified
  async verifyUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      user.isVerified =
        req.body.isVerified !== undefined ? req.body.isVerified : true;
      await user.save();

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: `User ${user.isVerified ? "verified" : "unverified"} successfully`,
        data: { id: user._id, isVerified: user.isVerified },
      });
    } catch (error) {
      logger.error(`verifyUser error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
