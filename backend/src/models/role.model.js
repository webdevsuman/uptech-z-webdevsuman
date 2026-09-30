import mongoose from "mongoose";
import Permission from "../models/permissions.model.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Role", roleSchema);
