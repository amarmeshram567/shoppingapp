import { apiRequest } from "./api";

export const storeApi = {
  authenticateWithClerk: (clerkToken) =>
    apiRequest("/auth/clerk", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkToken}`
      }
    }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  products: (params = {}) => apiRequest("/products", { params }),
  featuredProducts: (params = {}) => apiRequest("/products/featured", { params }),
  productFilters: () => apiRequest("/products/filters"),
  productDetail: (idOrSlug) => apiRequest(`/products/${idOrSlug}`),
  addReview: (id, body) => apiRequest(`/products/${id}/reviews`, { method: "POST", body }),
  me: () => apiRequest("/users/me"),
  updateProfile: (body) => apiRequest("/users/me", { method: "PATCH", body }),
  addAddress: (body) => apiRequest("/users/me/addresses", { method: "POST", body }),
  updateAddress: (addressId, body) => apiRequest(`/users/me/addresses/${addressId}`, { method: "PATCH", body }),
  deleteAddress: (addressId) => apiRequest(`/users/me/addresses/${addressId}`, { method: "DELETE" }),
  addPaymentMethod: (body) => apiRequest("/users/me/payment-methods", { method: "POST", body }),
  deletePaymentMethod: (paymentMethodId) => apiRequest(`/users/me/payment-methods/${paymentMethodId}`, { method: "DELETE" }),
  wishlist: () => apiRequest("/users/wishlist"),
  toggleWishlist: (productId) =>
    apiRequest("/users/wishlist/toggle", { method: "POST", body: { productId } }),
  cart: () => apiRequest("/cart"),
  addCartItem: (body) => apiRequest("/cart", { method: "POST", body }),
  updateCartItem: (itemId, body) => apiRequest(`/cart/${itemId}`, { method: "PATCH", body }),
  removeCartItem: (itemId) => apiRequest(`/cart/${itemId}`, { method: "DELETE" }),
  clearCart: () => apiRequest("/cart", { method: "DELETE" }),
  validateCoupon: (body) => apiRequest("/coupons/validate", { method: "POST", body }),
  createOrder: (body) => apiRequest("/orders", { method: "POST", body }),
  myOrders: () => apiRequest("/orders"),
  orderById: (id) => apiRequest(`/orders/${id}`)
};
