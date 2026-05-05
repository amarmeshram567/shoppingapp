import { Category } from "../models/Category.js";

export const categoryRepository = {
  create: (payload) => Category.create(payload),
  findById: (id) => Category.findById(id),
  findAll: () => Category.find({}).sort({ sortOrder: 1, name: 1 }).populate("parent", "name slug"),
  updateById: (id, payload) => Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  deleteById: (id) => Category.findByIdAndDelete(id)
};
