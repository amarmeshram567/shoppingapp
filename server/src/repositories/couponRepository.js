import { Coupon } from "../models/Coupon.js";

export const couponRepository = {
  create: (payload) => Coupon.create(payload),
  findById: (id) => Coupon.findById(id),
  findByCode: (code) => Coupon.findOne({ code }),
  findAll: () => Coupon.find({}).sort({ createdAt: -1 }),
  updateById: (id, payload) => Coupon.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  deleteById: (id) => Coupon.findByIdAndDelete(id)
};
