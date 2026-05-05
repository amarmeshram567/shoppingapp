import React, { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAppContext } from "../context/AppContext";

const Cart = () => {
  const { items, subtotal, count, updateQty, removeCartItem, validateCoupon, cartSummary } = useAppContext();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const navigate = useNavigate();

  const shipping = cartSummary?.shippingFee ?? (subtotal > 200 ? 0 : 12);
  const tax = +(cartSummary?.tax ?? subtotal * 0.08).toFixed(2);
  const total = subtotal - discount + shipping + tax;

  const apply = async () => {
    try {
      const response = await validateCoupon(coupon, subtotal);
      setDiscount(Number(response.discount || 0));
      setDiscountType(response.discountType || "");
      toast.success(`Coupon applied - ${response.discountType}`);
    } catch (error) {
      toast.error(error.message || "Invalid code");
    }
  };

  const proceedToCheckout = () => {
    navigate("/checkout", {
      state: {
        couponCode: coupon.trim(),
        discount
      }
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-luxe py-24 text-center">
          <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-3 font-display text-4xl">Your bag is empty</h1>
          <p className="mb-8 text-muted-foreground">Time to find something you'll love.</p>
          <Link to="/shop" className="inline-block rounded-full bg-foreground px-8 py-4 font-medium text-background">
            Continue shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-luxe py-12">
        <h1 className="mb-2 font-display text-4xl md:text-5xl">Your bag</h1>
        <p className="mb-10 text-muted-foreground">
          {count} {count === 1 ? "item" : "items"}
        </p>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[100px_1fr] gap-5 border-b border-border pb-6 md:grid-cols-[140px_1fr]">
                <Link to={`/product/${item.product.id}`} className="aspect-square overflow-hidden rounded-xl bg-secondary">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.product.brand}</p>
                      <Link to={`/product/${item.product.id}`} className="font-display text-lg hover:text-primary md:text-xl">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.color}
                        {item.size ? ` · ${item.size}` : ""}
                      </p>
                    </div>
                    <button onClick={() => removeCartItem(item.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center rounded-full border border-border">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-2">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-2">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-display text-xl">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl bg-secondary p-6 lg:sticky lg:top-24 lg:p-8">
            <h3 className="mb-6 font-display text-2xl">Order summary</h3>
            <div className="mb-6 flex gap-2">
              <input
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="Promo code"
                className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm outline-none"
              />
              <button onClick={apply} className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
                Apply
              </button>
            </div>
            <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" /> Enter your coupon code
            </p>
            {discount > 0 && discountType ? <p className="mb-6 text-xs text-success">Applied: {discountType}</p> : null}
            <div className="space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={proceedToCheckout}
              className="mt-6 block w-full rounded-full bg-foreground px-6 py-4 text-center font-medium text-background transition-smooth hover:bg-primary"
            >
              Proceed to checkout
            </button>
            <Link to="/shop" className="story-link mt-3 block text-center text-sm">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
