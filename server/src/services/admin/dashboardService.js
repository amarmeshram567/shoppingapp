import { userRepository } from "../../repositories/userRepository.js";
import { productRepository } from "../../repositories/productRepository.js";
import { orderRepository } from "../../repositories/orderRepository.js";
import { Product } from "../../models/Product.js";
import { Order } from "../../models/Order.js";
import { User } from "../../models/User.js";

export const dashboardService = {
  async getStats() {
    const [customers, products, orders, revenueAgg, monthlySales, recentOrders, lowStock] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      productRepository.count({}),
      orderRepository.count({}),
      orderRepository.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$total" } } }]),
      Order.aggregate([
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            totalSales: { $sum: "$total" },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Order.find({}).populate("user", "name email").sort({ createdAt: -1 }).limit(10),
      Product.find({ $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] } }).sort({ stockQuantity: 1 }).limit(20)
    ]);

    return {
      totals: {
        revenue: revenueAgg[0]?.totalRevenue || 0,
        orders,
        customers,
        products
      },
      monthlySales,
      revenueGraph: monthlySales.map((item) => ({
        label: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
        revenue: item.totalSales
      })),
      recentOrders,
      lowStockAlerts: lowStock
    };
  }
};
