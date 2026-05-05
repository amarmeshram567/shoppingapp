import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";
import { getPagination } from "../../utils/pagination.js";
import { ADMIN_ROLES } from "../../constants/roles.js";

export const customerService = {
  async listCustomers(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = { role: ADMIN_ROLES.CUSTOMER };

    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: "i" } },
        { name: { $regex: query.search, $options: "i" } },
        { firstName: { $regex: query.search, $options: "i" } },
        { lastName: { $regex: query.search, $options: "i" } }
      ];
    }

    if (query.blocked === "true") filter.isBlocked = true;
    if (query.blocked === "false") filter.isBlocked = false;

    const [items, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  },

  async setBlockStatus(customerId, blocked) {
    return User.findByIdAndUpdate(customerId, { isBlocked: blocked }, { new: true }).select("-password");
  },

  async getCustomerHistory(customerId) {
    const customer = await User.findById(customerId).select("-password");
    if (!customer) throw new Error("Customer not found");

    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });
    return { customer, orders };
  }
};
