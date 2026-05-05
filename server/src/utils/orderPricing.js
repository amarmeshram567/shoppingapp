import { env } from "../config/env.js";

export const calculateOrderPricing = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= env.freeShippingThreshold ? 0 : env.defaultShippingFee;
  const tax = Number((subtotal * env.taxRate).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingFee,
    tax,
    total
  };
};
