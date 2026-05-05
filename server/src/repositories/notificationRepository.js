import { Notification } from "../models/Notification.js";

export const notificationRepository = {
  create: (payload) => Notification.create(payload),
  findMany: (filter, options = {}) =>
    Notification.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20),
  count: (filter) => Notification.countDocuments(filter),
  updateById: (id, payload) => Notification.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
};
