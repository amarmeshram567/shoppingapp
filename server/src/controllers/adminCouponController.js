import { asyncHandler } from "../middleware/asyncHandler.js";
import { couponRepository } from "../repositories/couponRepository.js";
import { calculateCouponDiscount } from "../utils/coupon.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const listAdminCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponRepository.findAll();
  apiSuccess(res, { coupons });
});

export const createAdminCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponRepository.create({
    ...req.validated.body,
    code: req.validated.body.code.toUpperCase().trim()
  });
  apiSuccess(res, { message: "Coupon created", coupon }, 201);
});

export const updateAdminCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponRepository.updateById(req.params.id, req.body);
  apiSuccess(res, { message: "Coupon updated", coupon });
});

export const deleteAdminCoupon = asyncHandler(async (req, res) => {
  await couponRepository.deleteById(req.params.id);
  apiSuccess(res, { message: "Coupon deleted" });
});

export const validateAdminCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponRepository.findByCode(String(req.body.code).toUpperCase().trim());
  if (!coupon || !coupon.active) throw new Error("Coupon not found");
  const discount = calculateCouponDiscount({ coupon, subtotal: Number(req.body.subtotal || 0) });
  apiSuccess(res, { valid: true, coupon, discount });
});
