import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate wishlists for the same student and course
wishlistSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);
