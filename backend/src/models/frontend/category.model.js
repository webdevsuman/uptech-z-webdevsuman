import mongoose from "mongoose";
import stringField from "../../utils/commonFields/stringField.js";

const categorySchema = new mongoose.Schema({
  name: stringField({ required: true }),
  icon: stringField(),
});

export default mongoose.model("Category", categorySchema);
