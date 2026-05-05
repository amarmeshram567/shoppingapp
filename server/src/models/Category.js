import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

export const Category = mongoose.model("Category", categorySchema);
