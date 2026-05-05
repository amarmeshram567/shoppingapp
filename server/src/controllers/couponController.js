import { Coupon } from "../models/Coupon.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { calculateCouponDiscount } from "../utils/coupon.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal = 0 } = req.body;

  if (!code) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim() });

  if (!coupon || !coupon.active) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Coupon not found");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Coupon usage limit reached");
  }

  if (Number(subtotal) < coupon.minimumOrderAmount) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error(`Minimum order amount for this coupon is ${coupon.minimumOrderAmount}`);
  }

  const discount = calculateCouponDiscount({ coupon, subtotal: Number(subtotal) });

  res.status(HTTP_STATUS.OK).json({
    valid: true,
    code: coupon.code,
    discount,
    discountType: coupon.discountType
  });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.status(HTTP_STATUS.OK).json({ coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const payload = { ...req.body, code: String(req.body.code || "").toUpperCase().trim() };
  const coupon = await Coupon.create(payload);

  res.status(HTTP_STATUS.CREATED).json({
    message: "Coupon created",
    coupon
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Coupon not found");
  }

  Object.assign(coupon, req.body);
  if (req.body.code) {
    coupon.code = String(req.body.code).toUpperCase().trim();
  }
  await coupon.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Coupon updated",
    coupon
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();
  res.status(HTTP_STATUS.OK).json({ message: "Coupon deleted" });
});
