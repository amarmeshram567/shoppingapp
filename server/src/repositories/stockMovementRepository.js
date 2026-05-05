import { StockMovement } from "../models/StockMovement.js";

export const stockMovementRepository = {
  create: (payload) => StockMovement.create(payload),
  findMany: (filter, options = {}) =>
    StockMovement.find(filter)
      .populate("product", "name slug")
      .populate("actor", "name email")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
};
