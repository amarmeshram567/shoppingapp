import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    group: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
