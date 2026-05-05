import { Order } from "../models/Order.js";

export const orderRepository = {
  findMany: (filter, options = {}) =>
    Order.find(filter)
      .populate("user", "name email firstName lastName")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20),
  count: (filter) => Order.countDocuments(filter),
  findById: (id) => Order.findById(id).populate("user", "name email firstName lastName"),
  aggregate: (pipeline) => Order.aggregate(pipeline)
};
