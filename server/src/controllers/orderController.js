import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { Coupon } from "../models/Coupon.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { calculateOrderPricing } from "../utils/orderPricing.js";
import { calculateCouponDiscount } from "../utils/coupon.js";
import { getPagination } from "../utils/pagination.js";
import { isValidObjectId } from "../utils/validators.js";

const normalizeOrderItems = async (items) => {
  const productIds = items.map((item) => item.productId);

  if (productIds.some((id) => !isValidObjectId(id))) {
    throw new Error("One or more product ids are invalid");
  }

  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  return items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(`Product not found for item ${item.productId}`);
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    return {
      product,
      orderItem: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        color: item.color || "",
        size: item.size || ""
      }
    };
  });
};

export const createOrder = asyncHandler(async (req, res) => {
  const { items = [], shippingAddress = {}, paymentMethod = "cash_on_delivery", couponCode } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Order items are required");
  }

  if (!shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.country) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Incomplete shipping address");
  }

  const normalized = await normalizeOrderItems(items);
  const orderItems = normalized.map((entry) => entry.orderItem);
  const pricing = calculateOrderPricing(orderItems);
  let appliedCoupon = null;
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim() });

    if (!coupon || !coupon.active) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error("Invalid coupon");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error("Coupon has expired");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error("Coupon usage limit reached");
    }

    if (pricing.subtotal < coupon.minimumOrderAmount) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error(`Minimum order amount for this coupon is ${coupon.minimumOrderAmount}`);
    }

    discount = calculateCouponDiscount({ coupon, subtotal: pricing.subtotal });
    appliedCoupon = coupon;
  }

  const finalTotal = Number(Math.max(0, pricing.total - discount).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    ...pricing,
    total: finalTotal,
    couponCode: appliedCoupon?.code,
    discount
  });

  await Promise.all(
    normalized.map(({ product, orderItem }) =>
      Product.updateOne(
        { _id: product._id },
        {
          $inc: { stockQuantity: -orderItem.quantity }
        }
      )
    )
  );

  await Cart.updateOne(
    { user: req.user._id },
    {
      $pull: {
        items: {
          product: { $in: normalized.map(({ product }) => product._id) }
        }
      }
    }
  );

  if (appliedCoupon) {
    appliedCoupon.usedCount += 1;
    await appliedCoupon.save();
  }

  res.status(HTTP_STATUS.CREATED).json({
    message: "Order created",
    order
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(HTTP_STATUS.OK).json({ orders });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [orders, total] = await Promise.all([
    Order.find({})
      .populate("user", "firstName lastName name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({})
  ]);

  res.status(HTTP_STATUS.OK).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    orders
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "firstName lastName name email");

  if (!order) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Order not found");
  }

  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error("Not allowed to access this order");
  }

  res.status(HTTP_STATUS.OK).json({ order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Order not found");
  }

  const { status, isPaid } = req.body;

  if (status) {
    order.status = status;
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }
    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }
  }

  if (isPaid === true && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
    if (order.status === "pending") {
      order.status = "paid";
    }
  }

  await order.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Order updated",
    order
  });
});
