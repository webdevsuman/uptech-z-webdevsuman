import mongoose from "mongoose";
import stringField from "../../utils/commonFields/stringField.js";

const categorySchema = new mongoose.Schema(
  {
    name: stringField({ required: true }),
    icon: stringField(),
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Category", categorySchema);
