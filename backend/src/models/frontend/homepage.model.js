import mongoose from "mongoose";
import stringField from "../../utils/commonFields/stringField.js";

const homepageSchema = new mongoose.Schema(
  {
    section: stringField({ required: true }),
    title: stringField({ required: true }),
    description: stringField(),
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Homepage", homepageSchema);
