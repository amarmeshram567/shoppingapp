import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import Layout from "../components/layout/Layout";
import { useAppContext } from "../context/AppContext";

const steps = ["Shipping", "Payment", "Review"];

const paymentMethods = [
  { id: "card", Icon: CreditCard, label: "Credit / debit card" },
  { id: "paypal", Icon: Wallet, label: "PayPal" },
  { id: "cash_on_delivery", Icon: Wallet, label: "Cash on delivery" }
];

const emptyShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: ""
};

const Input = ({ label, className, ...rest }) => (
  <div className={className}>
    <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
    <input
      {...rest}
      className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none transition-smooth focus:border-foreground"
    />
  </div>
);

const Checkout = () => {
  const { items, subtotal, cartSummary, placeOrder, profile } = useAppContext();
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [shippingForm, setShippingForm] = useState(emptyShippingForm);
  const navigate = useNavigate();
  const location = useLocation();

  const couponCode = location.state?.couponCode?.trim() || "";
  const discount = Number(location.state?.discount || 0);
  const shipping = cartSummary?.shippingFee ?? (subtotal > 200 ? 0 : 12);
  const tax = +(cartSummary?.tax ?? subtotal * 0.08).toFixed(2);
  const total = useMemo(() => Math.max(0, subtotal - discount + shipping + tax), [discount, shipping, subtotal, tax]);
  const savedAddresses = profile?.addresses || [];

  useEffect(() => {
    const defaultAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0];

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress._id || defaultAddress.id || "");
      setShippingForm({
        fullName: defaultAddress.fullName || profile?.name || "",
        email: profile?.email || "",
        phone: defaultAddress.phone || profile?.phone || "",
        addressLine1: defaultAddress.addressLine1 || "",
        addressLine2: defaultAddress.addressLine2 || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        postalCode: defaultAddress.postalCode || "",
        country: defaultAddress.country || ""
      });
      return;
    }

    setShippingForm((current) => ({
      ...current,
      fullName: current.fullName || profile?.name || "",
      email: current.email || profile?.email || "",
      phone: current.phone || profile?.phone || ""
    }));
  }, [profile?.email, profile?.name, profile?.phone, savedAddresses]);

  const handleShippingChange = (field) => (event) => {
    setSelectedAddressId("");
    setShippingForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find((address) => (address._id || address.id) === addressId);
    if (!selectedAddress) return;

    setShippingForm({
      fullName: selectedAddress.fullName || profile?.name || "",
      email: profile?.email || "",
      phone: selectedAddress.phone || profile?.phone || "",
      addressLine1: selectedAddress.addressLine1 || "",
      addressLine2: selectedAddress.addressLine2 || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      postalCode: selectedAddress.postalCode || "",
      country: selectedAddress.country || ""
    });
  };

  const validateShipping = () => {
    if (!shippingForm.fullName || !shippingForm.addressLine1 || !shippingForm.city || !shippingForm.postalCode || !shippingForm.country) {
      toast.error("Please complete the required shipping fields");
      return false;
    }

    return true;
  };

  const continueToPayment = () => {
    if (!validateShipping()) return;
    setStep(1);
  };

  const reviewOrder = () => {
    if (!validateShipping()) return;
    setStep(2);
  };

  const submitOrder = async () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const order = await placeOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        shippingAddress: shippingForm,
        paymentMethod: pay,
        couponCode: couponCode || undefined
      });

      navigate("/order-success", {
        state: {
          orderId: order._id || order.id,
          total: order.total,
          email: shippingForm.email
        }
      });
    } catch (error) {
      toast.error(error.message || "Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-luxe grid gap-12 py-12 lg:grid-cols-[1fr_400px]">
        <div>
          <h1 className="mb-8 font-display text-4xl">Checkout</h1>
          <div className="mb-10 flex items-center gap-2">
            {steps.map((stepLabel, index) => (
              <div key={stepLabel} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${index <= step ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}
                >
                  {index + 1}
                </div>
                <span className={`text-sm ${index === step ? "font-medium" : "text-muted-foreground"}`}>{stepLabel}</span>
                {index < steps.length - 1 ? <div className="mx-2 h-px w-8 bg-border" /> : null}
              </div>
            ))}
          </div>

          {step === 0 ? (
            <div className="animate-fade-in space-y-6">
              <div>
                <h3 className="font-display text-2xl">Shipping address</h3>
                <p className="mt-2 text-sm text-muted-foreground">Complete the delivery details for this order.</p>
              </div>

              {savedAddresses.length ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-accent">Saved addresses</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {savedAddresses.map((address) => {
                      const addressId = address._id || address.id;
                      const active = selectedAddressId === addressId;

                      return (
                        <button
                          key={addressId}
                          type="button"
                          onClick={() => handleAddressSelect(addressId)}
                          className={`rounded-2xl border p-4 text-left transition-smooth ${active ? "border-foreground bg-secondary" : "border-border hover:border-foreground/40"}`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">{address.label || "Address"}</p>
                            {address.isDefault ? <CheckCircle2 className="h-4 w-4 text-success" /> : null}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {[address.addressLine1, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(", ")}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full name" value={shippingForm.fullName} onChange={handleShippingChange("fullName")} className="md:col-span-2" />
                <Input label="Email" type="email" value={shippingForm.email} onChange={handleShippingChange("email")} className="md:col-span-2" />
                <Input label="Phone" value={shippingForm.phone} onChange={handleShippingChange("phone")} className="md:col-span-2" />
                <Input label="Address line 1" value={shippingForm.addressLine1} onChange={handleShippingChange("addressLine1")} className="md:col-span-2" />
                <Input label="Address line 2" value={shippingForm.addressLine2} onChange={handleShippingChange("addressLine2")} className="md:col-span-2" />
                <Input label="City" value={shippingForm.city} onChange={handleShippingChange("city")} />
                <Input label="State / Region" value={shippingForm.state} onChange={handleShippingChange("state")} />
                <Input label="ZIP / Postal" value={shippingForm.postalCode} onChange={handleShippingChange("postalCode")} />
                <Input label="Country" value={shippingForm.country} onChange={handleShippingChange("country")} />
              </div>

              <button onClick={continueToPayment} className="mt-4 h-14 w-full rounded-full bg-foreground font-medium text-background">
                Continue to payment
              </button>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-display text-2xl">Payment method</h3>
              <div className="space-y-3">
                {paymentMethods.map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setPay(id)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-5 transition-smooth ${pay === id ? "border-foreground bg-secondary" : "border-border"}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {pay === "card" ? (
                <div className="grid gap-4 pt-4 md:grid-cols-2">
                  <Input label="Card number" className="md:col-span-2" />
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVC" />
                  <Input label="Name on card" className="md:col-span-2" />
                </div>
              ) : null}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(0)} className="h-14 flex-1 rounded-full border border-border font-medium">
                  Back
                </button>
                <button onClick={reviewOrder} className="h-14 flex-1 rounded-full bg-foreground font-medium text-background">
                  Review order
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="animate-fade-in">
              <h3 className="mb-4 font-display text-2xl">Review your order</h3>
              <div className="mb-6 rounded-2xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4" />
                  Shipping to
                </div>
                <p className="text-sm text-muted-foreground">
                  {[
                    shippingForm.fullName,
                    shippingForm.addressLine1,
                    shippingForm.addressLine2,
                    shippingForm.city,
                    shippingForm.state,
                    shippingForm.postalCode,
                    shippingForm.country
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="mb-6 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-border pb-3">
                    <img src={item.product.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty {item.quantity}
                        {item.color ? ` · ${item.color}` : ""}
                        {item.size ? ` · ${item.size}` : ""}
                      </p>
                    </div>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="h-14 flex-1 rounded-full border border-border font-medium">
                  Back
                </button>
                <button
                  onClick={submitOrder}
                  disabled={submitting}
                  className="h-14 flex-1 rounded-full bg-gradient-primary font-medium text-primary-foreground shadow-glow disabled:opacity-50"
                >
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl bg-secondary p-6 lg:sticky lg:top-24">
          <h3 className="mb-4 font-display text-xl">Order summary</h3>
          <div className="mb-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product.name} x {item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
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
          {couponCode ? <p className="mt-4 text-xs text-success">Coupon ready for order: {couponCode}</p> : null}
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            Secure SSL checkout
          </p>
        </aside>
      </div>
    </Layout>
  );
};

export default Checkout;
