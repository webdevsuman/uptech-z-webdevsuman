import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      minlength: 5,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Announcement", announcementSchema);
