export const calculateCouponDiscount = ({ coupon, subtotal }) => {
  if (!coupon || !coupon.active) {
    return 0;
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = subtotal * (coupon.discountValue / 100);
  } else {
    discount = coupon.discountValue;
  }

  if (coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  return Number(Math.max(0, discount).toFixed(2));
};
