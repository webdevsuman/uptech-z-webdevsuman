import mongoose from "mongoose";
import stringField from "../../utils/commonFields/stringField.js";

const tagSchema = new mongoose.Schema({
  name: stringField({ required: true }),
},{
  timestamps: true,
  versionKey: false
});

export default mongoose.model("Tag", tagSchema);
