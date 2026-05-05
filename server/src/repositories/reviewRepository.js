import { Review } from "../models/Review.js";

export const reviewRepository = {
  findMany: (filter, options = {}) =>
    Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name slug image")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20),
  count: (filter) => Review.countDocuments(filter),
  findById: (id) => Review.findById(id),
  updateById: (id, payload) => Review.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  deleteById: (id) => Review.findByIdAndDelete(id)
};
