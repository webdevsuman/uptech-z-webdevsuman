import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    bio:{
      type: String,
      required: false,
    },
    qualification:{
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    isVerified:{
      type: Boolean,
      default: false,
    },
    isActive:{
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    resetToken:{
      type: String,
      default: null,
    },
    resetTokenExpiryTime:{
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("User", userSchema);
