import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    // Step 1: Foundational (Required on creation)
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Step 2: Landing Page Details (Updated incrementally)
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all_levels"],
      default: "all_levels",
    },
    language: { type: String, default: "English" },
    thumbnail: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    // Step 3: Pricing
    price: { type: Number, default: 0, min: 0 },

    // Status & Publishing
    status: {
      type: String,
      enum: ["draft", "under_review", "published"],
      default: "draft",
    },

    // Discovery & Highlights
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0, min: 0 },

    // Curriculum & Syllabus
    sections: [
      {
        title: { type: String, required: true, trim: true },
        order: { type: Number, default: 1 },
        lectures: [
          {
            title: { type: String, required: true, trim: true },
            description: { type: String, default: "" },
            order: { type: Number, default: 1 },
            isPreview: { type: Boolean, default: false },
            video: {
              url: { type: String, default: "" },
              public_id: { type: String, default: "" },
              duration: { type: Number, default: 0 },
            },
            resources: [
              {
                title: { type: String, required: true },
                url: { type: String, required: true },
                public_id: { type: String, default: "" },
                fileType: { type: String, default: "pdf" },
                fileSize: { type: Number, default: 0 },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Course", courseSchema);
