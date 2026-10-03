import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientRole: {
      type: String,
      default: "super-admin",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["course_under_review", "course_approved", "course_rejected", "general"],
      default: "general",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      courseTitle: String,
      instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      instructorName: String,
      instructorAvatar: String,
      link: {
        type: String,
        default: "/courses",
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
