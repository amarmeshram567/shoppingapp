import { notificationRepository } from "../../repositories/notificationRepository.js";
import { Product } from "../../models/Product.js";
import { Order } from "../../models/Order.js";
import { getPagination } from "../../utils/pagination.js";
import { NOTIFICATION_TYPES } from "../../constants/notification.js";

export const notificationService = {
  async listNotifications(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    const [items, total] = await Promise.all([
      notificationRepository.findMany(filter, { skip, limit }),
      notificationRepository.count(filter)
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  },

  async markRead(id) {
    return notificationRepository.updateById(id, { isRead: true });
  },

  async generateSystemAlerts() {
    const [lowStock, pendingRefunds, newOrders] = await Promise.all([
      Product.find({ $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] } }).limit(20),
      Order.find({ status: "refunded" }).sort({ updatedAt: -1 }).limit(10),
      Order.find({ status: "pending" }).sort({ createdAt: -1 }).limit(10)
    ]);

    const alerts = [];

    for (const product of lowStock) {
      alerts.push(
        await notificationRepository.create({
          type: NOTIFICATION_TYPES.LOW_STOCK,
          title: "Low stock alert",
          message: `${product.name} stock is down to ${product.stockQuantity}`,
          metadata: { productId: product._id.toString() }
        })
      );
    }

    for (const order of newOrders) {
      alerts.push(
        await notificationRepository.create({
          type: NOTIFICATION_TYPES.NEW_ORDER,
          title: "New order alert",
          message: `New order ${order._id} received`,
          metadata: { orderId: order._id.toString() }
        })
      );
    }

    for (const order of pendingRefunds) {
      alerts.push(
        await notificationRepository.create({
          type: NOTIFICATION_TYPES.REFUND_REQUEST,
          title: "Refund request alert",
          message: `Refund processed for order ${order._id}`,
          metadata: { orderId: order._id.toString() }
        })
      );
    }

    return alerts;
  }
};
