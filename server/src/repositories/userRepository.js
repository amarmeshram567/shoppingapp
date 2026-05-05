import { User } from "../models/User.js";

export const userRepository = {
  findById: (id) => User.findById(id),
  findByEmail: (email) => User.findOne({ email }),
  create: (payload) => User.create(payload),
  findCustomers: (filter, options = {}) =>
    User.find(filter)
      .select("-password")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20),
  countCustomers: (filter) => User.countDocuments(filter),
  updateById: (id, payload) => User.findByIdAndUpdate(id, payload, { new: true }),
  findAllAdmins: () => User.find({ role: { $in: ["super_admin", "manager", "staff"] } }).select("-password")
};
