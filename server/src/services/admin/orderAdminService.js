import { orderRepository } from "../../repositories/orderRepository.js";
import { stockMovementRepository } from "../../repositories/stockMovementRepository.js";
import { notificationRepository } from "../../repositories/notificationRepository.js";
import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { getPagination } from "../../utils/pagination.js";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../constants/order.js";
import { NOTIFICATION_TYPES } from "../../constants/notification.js";
import { STOCK_MOVEMENT_TYPES } from "../../constants/stock.js";

const pushTimeline = (order, status, note, userId) => {
  order.timeline.push({
    status,
    note,
    changedBy: userId,
    changedAt: new Date()
  });
};

export const orderAdminService = {
  async listOrders(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;

    const [items, total] = await Promise.all([
      orderRepository.findMany(filter, { skip, limit }),
      orderRepository.count(filter)
    ]);

    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  },

  async getOrder(id) {
    return orderRepository.findById(id);
  },

  async updateStatus(id, payload, actorId) {
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (payload.status) {
      order.status = payload.status;
      pushTimeline(order, payload.status, payload.note || "", actorId);
      if (payload.status === ORDER_STATUS.DELIVERED) order.deliveredAt = new Date();
      if (payload.status === ORDER_STATUS.CANCELLED) order.cancelledAt = new Date();
    }

    if (payload.paymentStatus) {
      order.paymentStatus = payload.paymentStatus;
      if (payload.paymentStatus === PAYMENT_STATUS.PAID) {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    await order.save();

    await notificationRepository.create({
      type: NOTIFICATION_TYPES.NEW_ORDER,
      title: "Order updated",
      message: `Order ${order._id} updated to ${order.status}`,
      metadata: { orderId: order._id.toString() }
    });

    return order;
  },

  async cancelOrRefund(id, payload, actorId) {
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    const targetStatus = payload.action === "refund" ? ORDER_STATUS.REFUNDED : ORDER_STATUS.CANCELLED;
    order.status = targetStatus;
    if (payload.action === "refund") {
      order.paymentStatus = PAYMENT_STATUS.REFUNDED;
      order.refundedAt = new Date();
    } else {
      order.cancelledAt = new Date();
    }
    order.refundReason = payload.reason || "";
    pushTimeline(order, targetStatus, payload.reason || "", actorId);
    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const previousStock = product.stockQuantity;
      product.stockQuantity += item.quantity;
      product.inStock = product.stockQuantity > 0;
      await product.save();

      await stockMovementRepository.create({
        product: product._id,
        type: STOCK_MOVEMENT_TYPES.REFUND_RESTORE,
        quantity: item.quantity,
        previousStock,
        newStock: product.stockQuantity,
        note: `${payload.action} for order ${order._id}`,
        actor: actorId
      });
    }

    await notificationRepository.create({
      type: NOTIFICATION_TYPES.REFUND_REQUEST,
      title: payload.action === "refund" ? "Order refunded" : "Order cancelled",
      message: `Order ${order._id} ${payload.action} processed`,
      metadata: { orderId: order._id.toString() }
    });

    return order;
  },

  async generateInvoice(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    if (!order.invoiceNumber) {
      order.invoiceNumber = `INV-${Date.now()}`;
      await order.save();
    }

    return {
      invoiceNumber: order.invoiceNumber,
      issuedAt: new Date(),
      order
    };
  }
};
