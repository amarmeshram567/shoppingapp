import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [usersCount, productsCount, ordersCount, revenue] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ])
  ]);

  const recentOrders = await Order.find({})
    .populate("user", "firstName lastName name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(HTTP_STATUS.OK).json({
    stats: {
      usersCount,
      productsCount,
      ordersCount,
      totalRevenue: revenue[0]?.totalRevenue || 0
    },
    recentOrders
  });
});
