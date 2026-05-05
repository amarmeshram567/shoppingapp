import { CreditCard, Edit3, Heart, LoaderCircle, LogOut, MapPin, Package, Trash2, User, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "../components/layout/Layout";
import { useAppContext } from "../context/AppContext";

const tabs = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "orders", label: "Orders", Icon: Package },
  { id: "addresses", label: "Addresses", Icon: MapPin },
  { id: "wishlist", label: "Wishlist", Icon: Heart },
  { id: "payment", label: "Payment", Icon: CreditCard }
];

const emptyAddressForm = {
  label: "",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false
};

const emptyPaymentMethodForm = {
  label: "",
  brand: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  isDefault: false
};

const Field = ({ label, className = "", ...rest }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
    <input
      {...rest}
      className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none transition-smooth focus:border-foreground"
    />
  </label>
);

const Dashboard = () => {
  const {
    loadingStore,
    profile,
    orders,
    wishlist,
    logout,
    saveAddress,
    removeAddress,
    savePaymentMethod,
    removePaymentMethod
  } = useAppContext();
  const [tab, setTab] = useState("profile");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [savingAddress, setSavingAddress] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentMethodForm);
  const [savingPaymentMethod, setSavingPaymentMethod] = useState(false);
  const navigate = useNavigate();

  const userRows = useMemo(
    () => [
      ["Name", profile?.name || "-"],
      ["Email", profile?.email || "-"],
      ["Phone", profile?.phone || "-"],
      ["Member since", profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"]
    ],
    [profile]
  );

  const addresses = profile?.addresses || [];
  const paymentMethods = profile?.paymentMethods || [];

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddressId(address._id || address.id || null);
      setAddressForm({
        label: address.label || "",
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        isDefault: Boolean(address.isDefault)
      });
    } else {
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm);
    }

    setAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setAddressModalOpen(false);
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
  };

  const openPaymentModal = () => {
    setPaymentForm(emptyPaymentMethodForm);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentForm(emptyPaymentMethodForm);
  };

  const handleAddressChange = (field) => (event) => {
    const value = field === "isDefault" ? event.target.checked : event.target.value;
    setAddressForm((current) => ({ ...current, [field]: value }));
  };

  const handlePaymentMethodChange = (field) => (event) => {
    const value = field === "isDefault" ? event.target.checked : event.target.value;
    setPaymentForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();
    setSavingAddress(true);
    try {
      await saveAddress(addressForm, editingAddressId);
      toast.success(editingAddressId ? "Address updated" : "Address added");
      closeAddressModal();
    } catch (error) {
      toast.error(error.message || "Unable to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await removeAddress(addressId);
      toast.success("Address removed");
    } catch (error) {
      toast.error(error.message || "Unable to remove address");
    }
  };

  const handleSavePaymentMethod = async (event) => {
    event.preventDefault();
    setSavingPaymentMethod(true);

    try {
      const digitsOnly = paymentForm.cardNumber.replace(/\D/g, "");

      if (digitsOnly.length < 4) {
        throw new Error("Card number must include at least 4 digits");
      }

      await savePaymentMethod({
        label: paymentForm.label || "Card",
        brand: paymentForm.brand.trim(),
        last4: digitsOnly.slice(-4),
        expiryMonth: Number(paymentForm.expiryMonth),
        expiryYear: Number(paymentForm.expiryYear),
        isDefault: paymentForm.isDefault
      });

      toast.success("Payment method added");
      closePaymentModal();
    } catch (error) {
      toast.error(error.message || "Unable to save payment method");
    } finally {
      setSavingPaymentMethod(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    try {
      await removePaymentMethod(paymentMethodId);
      toast.success("Payment method removed");
    } catch (error) {
      toast.error(error.message || "Unable to remove payment method");
    }
  };

  const handleLogout = () => {
    Promise.resolve(logout()).then(() => navigate("/login"));
  };

  if (loadingStore) {
    return (
      <Layout>
        <div className="container-luxe py-24">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            <div className="space-y-3">
              <div className="h-12 animate-pulse rounded-xl bg-secondary" />
              <div className="h-12 animate-pulse rounded-xl bg-secondary" />
              <div className="h-12 animate-pulse rounded-xl bg-secondary" />
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-luxe py-12">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary font-display text-2xl text-primary-foreground">
            {profile?.name?.[0] || profile?.email?.[0] || "A"}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Welcome back</p>
            <h1 className="font-display text-3xl">{profile?.name || profile?.email || "Account"}</h1>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside>
            <nav className="space-y-1">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-smooth ${tab === id ? "bg-foreground text-background" : "hover:bg-secondary"}`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </aside>

          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            {tab === "profile" ? (
              <div className="animate-fade-in">
                <div className="mb-6 flex items-start justify-between">
                  <h2 className="font-display text-2xl">Profile</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {userRows.map(([label, value]) => (
                    <div key={label}>
                      <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "orders" ? (
              <div className="animate-fade-in">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="font-display text-2xl">Order history</h2>
                  <Link
                    to="/shop"
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-smooth hover:bg-secondary"
                  >
                    Browse products
                  </Link>
                </div>
                {orders.length ? (
                  <div className="max-h-[32rem] space-y-4 overflow-y-auto pr-2">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-border p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-lg">${order.total}</p>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${order.status === "Delivered" ? "bg-success/10 text-success" : "bg-accent-soft text-accent"}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {order.items?.length ? (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {order.items.map((item, index) => (
                              <Link
                                key={`${order.id}-${item.productId || item.name}-${index}`}
                                to={item.productId ? `/product/${item.productId}` : "/shop"}
                                className="flex items-center gap-3 rounded-xl border border-border/70 p-3 transition-smooth hover:bg-secondary"
                              >
                                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty {item.quantity}
                                    {item.color ? ` · ${item.color}` : ""}
                                    {item.size ? ` · ${item.size}` : ""}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-muted-foreground">No item details available for this order.</p>
                        )}

                        <div className="mt-4">
                          <Link to="/shop" className="text-sm font-medium story-link">
                            Continue shopping
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No orders yet.</p>
                )}
              </div>
            ) : null}

            {tab === "addresses" ? (
              <div className="animate-fade-in">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="font-display text-2xl">Saved addresses</h2>
                  <button
                    onClick={() => openAddressModal()}
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-smooth hover:bg-primary"
                  >
                    Add address
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div key={address._id || address.label} className="rounded-xl border border-border p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="mb-1 text-xs uppercase tracking-widest text-accent">{address.label || "Address"}</p>
                          {address.isDefault ? <p className="text-xs text-success">Default</p> : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openAddressModal(address)} className="text-muted-foreground transition-smooth hover:text-foreground">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id || address.id)}
                            className="text-muted-foreground transition-smooth hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{address.fullName || profile?.name || "-"}</p>
                      {address.phone ? <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p> : null}
                      <p className="mt-2 text-sm">
                        {[address.addressLine1, address.addressLine2, address.city, address.state, address.postalCode, address.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  ))}

                  {!addresses.length ? (
                    <button
                      onClick={() => openAddressModal()}
                      className="rounded-xl border-2 border-dashed border-border p-5 text-muted-foreground transition-smooth hover:border-foreground hover:text-foreground"
                    >
                      + Add your first address
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {tab === "wishlist" ? (
              <div className="animate-fade-in">
                <h2 className="mb-6 font-display text-2xl">Wishlist ({wishlist.length})</h2>
                {wishlist.length === 0 ? (
                  <p className="text-muted-foreground">No saved items.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {wishlist.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex gap-3 rounded-xl border border-border p-3 transition-smooth hover:bg-secondary"
                      >
                        <img src={product.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {tab === "payment" ? (
              <div className="animate-fade-in">
                <h2 className="mb-6 font-display text-2xl">Payment methods</h2>
                <div className="space-y-3">
                  {paymentMethods.length ? (
                    paymentMethods.map((method) => (
                      <div key={method._id} className="relative rounded-xl bg-gradient-primary p-5 text-primary-foreground">
                        <button
                          onClick={() => handleDeletePaymentMethod(method._id)}
                          className="absolute right-3 top-3 rounded-full p-1.5 text-primary-foreground/80 transition-smooth hover:bg-white/10 hover:text-primary-foreground"
                          aria-label="Remove payment method"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <p className="text-xs uppercase tracking-widest opacity-70">{method.label || method.brand}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-widest opacity-60">{method.brand}</p>
                        <p className="mt-3 font-mono text-xl tracking-wider">•••• •••• •••• {method.last4}</p>
                        <p className="mt-2 text-xs opacity-70">
                          Expires {String(method.expiryMonth).padStart(2, "0")}/{String(method.expiryYear).slice(-2)}
                        </p>
                        {method.isDefault ? <p className="mt-2 text-xs opacity-90">Default payment method</p> : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No payment methods saved yet.</p>
                  )}
                  <button
                    onClick={openPaymentModal}
                    className="w-full rounded-xl border-2 border-dashed border-border p-5 text-muted-foreground transition-smooth hover:border-foreground hover:text-foreground"
                  >
                    + Add payment method
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {addressModalOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/45 p-3 backdrop-blur-sm sm:p-4">
          <div className="flex min-h-full items-start justify-center py-3 sm:items-center sm:py-6">
            <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-accent">
                    {editingAddressId ? "Update address" : "New address"}
                  </p>
                  <h3 className="font-display text-2xl">{editingAddressId ? "Edit address" : "Add address"}</h3>
                </div>
                <button onClick={closeAddressModal} className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Label" value={addressForm.label} onChange={handleAddressChange("label")} placeholder="Home, Work" />
                    <Field label="Full name" value={addressForm.fullName} onChange={handleAddressChange("fullName")} placeholder="Recipient name" />
                    <Field label="Phone" value={addressForm.phone} onChange={handleAddressChange("phone")} placeholder="Phone number" />
                    <Field label="Country" value={addressForm.country} onChange={handleAddressChange("country")} placeholder="Country" />
                    <Field
                      label="Address line 1"
                      value={addressForm.addressLine1}
                      onChange={handleAddressChange("addressLine1")}
                      placeholder="Street address"
                      className="md:col-span-2"
                    />
                    <Field
                      label="Address line 2"
                      value={addressForm.addressLine2}
                      onChange={handleAddressChange("addressLine2")}
                      placeholder="Apartment, suite, etc."
                      className="md:col-span-2"
                    />
                    <Field label="City" value={addressForm.city} onChange={handleAddressChange("city")} placeholder="City" />
                    <Field label="State" value={addressForm.state} onChange={handleAddressChange("state")} placeholder="State" />
                    <Field label="Postal code" value={addressForm.postalCode} onChange={handleAddressChange("postalCode")} placeholder="Postal code" />
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange("isDefault")}
                      className="accent-foreground"
                    />
                    Set as default address
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                  <button
                    type="button"
                    onClick={closeAddressModal}
                    className="w-full rounded-full border border-border px-5 py-3 text-sm font-medium transition-smooth hover:bg-secondary sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-smooth hover:bg-primary disabled:opacity-70 sm:min-w-36 sm:w-auto"
                  >
                    {savingAddress ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {savingAddress ? "Saving..." : editingAddressId ? "Update address" : "Save address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {paymentModalOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/45 p-3 backdrop-blur-sm sm:p-4">
          <div className="flex min-h-full items-start justify-center py-3 sm:items-center sm:py-6">
            <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-accent">Payment details</p>
                  <h3 className="font-display text-2xl">Add payment method</h3>
                </div>
                <button onClick={closePaymentModal} className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSavePaymentMethod} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Label" value={paymentForm.label} onChange={handlePaymentMethodChange("label")} placeholder="Personal card" />
                    <Field label="Brand" value={paymentForm.brand} onChange={handlePaymentMethodChange("brand")} placeholder="Visa, Mastercard" />
                    <Field
                      label="Card number"
                      value={paymentForm.cardNumber}
                      onChange={handlePaymentMethodChange("cardNumber")}
                      placeholder="1234 5678 9012 3456"
                      className="md:col-span-2"
                    />
                    <Field
                      label="Expiry month"
                      type="number"
                      min="1"
                      max="12"
                      value={paymentForm.expiryMonth}
                      onChange={handlePaymentMethodChange("expiryMonth")}
                      placeholder="MM"
                    />
                    <Field
                      label="Expiry year"
                      type="number"
                      min={new Date().getFullYear()}
                      value={paymentForm.expiryYear}
                      onChange={handlePaymentMethodChange("expiryYear")}
                      placeholder="YYYY"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={paymentForm.isDefault}
                      onChange={handlePaymentMethodChange("isDefault")}
                      className="accent-foreground"
                    />
                    Set as default payment method
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                  <button
                    type="button"
                    onClick={closePaymentModal}
                    className="w-full rounded-full border border-border px-5 py-3 text-sm font-medium transition-smooth hover:bg-secondary sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPaymentMethod}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-smooth hover:bg-primary disabled:opacity-70 sm:min-w-36 sm:w-auto"
                  >
                    {savingPaymentMethod ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {savingPaymentMethod ? "Saving..." : "Save payment method"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};

export default Dashboard;
