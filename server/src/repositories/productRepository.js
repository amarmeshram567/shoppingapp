import { Product } from "../models/Product.js";

export const productRepository = {
  create: (payload) => Product.create(payload),
  findById: (id) => Product.findById(id),
  findBySlug: (slug) => Product.findOne({ slug }),
  findMany: (filter, options = {}) =>
    Product.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .populate("categoryRef", "name slug"),
  count: (filter) => Product.countDocuments(filter),
  updateById: (id, payload) => Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  deleteById: (id) => Product.findByIdAndDelete(id),
  aggregate: (pipeline) => Product.aggregate(pipeline)
};
