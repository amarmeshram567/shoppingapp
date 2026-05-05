import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ""
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage"
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minimumOrderAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    maxDiscountAmount: {
      type: Number,
      min: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    expiresAt: Date,
    usageLimit: {
      type: Number,
      min: 0
    },
    usedCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
