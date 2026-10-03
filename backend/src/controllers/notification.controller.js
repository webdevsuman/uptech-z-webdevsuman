import Notification from "../models/notification.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class NotificationController {
  // 1. Get latest notifications for admin
  async getAdminNotifications(req, res) {
    try {
      const [notifications, unreadCount] = await Promise.all([
        Notification.find({ recipientRole: "super-admin" })
          .sort({ createdAt: -1 })
          .limit(30),
        Notification.countDocuments({
          recipientRole: "super-admin",
          isRead: false,
        }),
      ]);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (error) {
      logger.error(`getAdminNotifications error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch notifications",
        error: error.message,
      });
    }
  }

  // 2. Mark single notification as read
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Notification not found",
        });
      }

      const unreadCount = await Notification.countDocuments({
        recipientRole: "super-admin",
        isRead: false,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Notification marked as read",
        data: {
          notification,
          unreadCount,
        },
      });
    } catch (error) {
      logger.error(`markAsRead error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to mark notification as read",
        error: error.message,
      });
    }
  }

  // 3. Mark all admin notifications as read
  async markAllAsRead(req, res) {
    try {
      await Notification.updateMany(
        { recipientRole: "super-admin", isRead: false },
        { isRead: true }
      );

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "All notifications marked as read",
        data: { unreadCount: 0 },
      });
    } catch (error) {
      logger.error(`markAllAsRead error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to mark all notifications as read",
        error: error.message,
      });
    }
  }

  // 4. Delete single notification
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Notification.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Notification not found",
        });
      }

      const unreadCount = await Notification.countDocuments({
        recipientRole: "super-admin",
        isRead: false,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Notification deleted successfully",
        data: { id, unreadCount },
      });
    } catch (error) {
      logger.error(`deleteNotification error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete notification",
        error: error.message,
      });
    }
  }

  // 5. Delete all admin notifications
  async deleteAllNotifications(req, res) {
    try {
      await Notification.deleteMany({ recipientRole: "super-admin" });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "All notifications cleared successfully",
        data: { unreadCount: 0 },
      });
    } catch (error) {
      logger.error(`deleteAllNotifications error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to clear notifications",
        error: error.message,
      });
    }
  }
}

export default new NotificationController();
