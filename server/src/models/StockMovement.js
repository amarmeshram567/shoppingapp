import mongoose from "mongoose";
import { STOCK_MOVEMENT_TYPES } from "../constants/stock.js";

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantSku: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: Object.values(STOCK_MOVEMENT_TYPES),
      required: true
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true, min: 0 },
    newStock: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true, default: "" },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

stockMovementSchema.index({ product: 1, createdAt: -1 });

export const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
