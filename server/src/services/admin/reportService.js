import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";
import { stringify } from "csv-stringify/sync";

export const reportService = {
  async revenueReport() {
    return Order.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
  },

  async salesReport() {
    return Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
    ]);
  },

  async productPerformance() {
    return Product.aggregate([
      {
        $project: {
          name: 1,
          stockQuantity: 1,
          rating: 1,
          reviews: 1,
          revenueScore: { $multiply: ["$price", "$reviews"] }
        }
      },
      { $sort: { revenueScore: -1 } },
      { $limit: 20 }
    ]);
  },

  async userGrowthReport() {
    return User.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
  },

  async exportCsv(rows) {
    return stringify(rows, { header: true });
  }
};
