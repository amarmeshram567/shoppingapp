import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    color: { type: String, trim: true, default: "" },
    size: { type: String, trim: true, default: "" },
    price: { type: Number, min: 0, required: true },
    stockQuantity: { type: Number, min: 0, default: 0 },
    image: { type: String, trim: true, default: "" }
  },
  { _id: true }
);

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, trim: true, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    image: { type: String, required: true, trim: true },
    hoverImage: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    badge: { type: String, trim: true },
    colors: [colorSchema],
    sizes: [{ type: String, trim: true }],
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, min: 0, default: 10 },
    lowStockThreshold: { type: Number, min: 0, default: 5 },
    skuPrefix: { type: String, trim: true, default: "" },
    variants: { type: [variantSchema], default: [] },
    description: { type: String, required: true },
    specs: [specSchema],
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

productSchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  if (this.originalPrice && this.originalPrice < this.price) {
    this.originalPrice = this.originalPrice;
  }

  this.inStock = this.stockQuantity > 0;
  next();
});

productSchema.index({
  name: "text",
  brand: "text",
  category: "text",
  tags: "text",
  description: "text"
});

export const Product = mongoose.model("Product", productSchema);
