import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { calculateOrderPricing } from "../utils/orderPricing.js";
import { isValidObjectId } from "../utils/validators.js";

const populateCart = (query) =>
  query.populate("items.product", "name slug image price originalPrice stockQuantity inStock colors sizes");

const buildCartSummary = (cart) => {
  const validItems = cart.items.filter((item) => item.product);
  const pricedItems = validItems.map((item) => ({
    price: item.product.price,
    quantity: item.quantity
  }));
  const summary = calculateOrderPricing(pricedItems);

  return {
    ...cart.toObject(),
    items: validItems,
    summary
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(Cart.findOne({ user: req.user._id }));

  if (!cart) {
    return res.status(HTTP_STATUS.OK).json({
      cart: {
        user: req.user._id,
        items: [],
        summary: calculateOrderPricing([])
      }
    });
  }

  res.status(HTTP_STATUS.OK).json({
    cart: buildCartSummary(cart)
  });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, color = "", size = "" } = req.body;

  if (!isValidObjectId(productId)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Invalid product id");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Product not found");
  }

  const qty = Math.max(1, Number(quantity) || 1);
  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.color === color &&
      item.size === size
  );

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.items.push({
      product: product._id,
      quantity: qty,
      color,
      size
    });
  }

  await cart.save();
  const hydratedCart = await populateCart(Cart.findById(cart._id));

  res.status(HTTP_STATUS.CREATED).json({
    message: "Item added to cart",
    cart: buildCartSummary(hydratedCart)
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);

  if (!item) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Cart item not found");
  }

  item.quantity = Math.max(1, Number(quantity) || 1);
  await cart.save();
  const hydratedCart = await populateCart(Cart.findById(cart._id));

  res.status(HTTP_STATUS.OK).json({
    message: "Cart item updated",
    cart: buildCartSummary(hydratedCart)
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);

  if (!item) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Cart item not found");
  }

  item.deleteOne();
  await cart.save();
  const hydratedCart = await populateCart(Cart.findById(cart._id));

  res.status(HTTP_STATUS.OK).json({
    message: "Cart item removed",
    cart: buildCartSummary(hydratedCart)
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Cart cleared",
    cart: buildCartSummary(cart)
  });
});
