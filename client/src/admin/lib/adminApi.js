import axios from "axios";
import { adminStorage } from "./adminStorage";

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "/api/admin-panel";

export const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

adminApi.interceptors.request.use((config) => {
  const token = adminStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const normalizeError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback || "Request failed";

export const adminRequest = async (requestConfig, fallbackMessage) => {
  try {
    const response = await adminApi(requestConfig);
    return response.data;
  } catch (error) {
    const wrappedError = new Error(normalizeError(error, fallbackMessage));
    wrappedError.statusCode = error.response?.status;
    throw wrappedError;
  }
};

export const adminAuthApi = {
  login: (payload) =>
    adminRequest(
      {
        url: "/auth/login",
        method: "POST",
        data: payload
      },
      "Unable to sign in"
    ),
  forgotPassword: (payload) =>
    adminRequest(
      {
        url: "/auth/forgot-password",
        method: "POST",
        data: payload
      },
      "Unable to send reset link"
    ),
  resetPassword: (payload) =>
    adminRequest(
      {
        url: "/auth/reset-password",
        method: "POST",
        data: payload
      },
      "Unable to reset password"
    ),
  me: () =>
    adminRequest(
      {
        url: "/auth/me",
        method: "GET"
      },
      "Unable to load admin profile"
    ),
  logout: () =>
    adminRequest(
      {
        url: "/auth/logout",
        method: "POST"
      },
      "Unable to logout"
    )
};

export const adminDashboardApi = {
  overview: () =>
    adminRequest(
      {
        url: "/dashboard",
        method: "GET"
      },
      "Unable to load dashboard"
    )
};

export const adminCatalogApi = {
  listProducts: (params) =>
    adminRequest(
      {
        url: "/catalog/products",
        method: "GET",
        params
      },
      "Unable to load products"
    ),
  createProduct: (payload) =>
    adminRequest(
      {
        url: "/catalog/products",
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      },
      "Unable to create product"
    ),
  updateProduct: (id, payload) =>
    adminRequest(
      {
        url: `/catalog/products/${id}`,
        method: "PATCH",
        data: payload
      },
      "Unable to update product"
    ),
  deleteProduct: (id) =>
    adminRequest(
      {
        url: `/catalog/products/${id}`,
        method: "DELETE"
      },
      "Unable to delete product"
    ),
  updateInventory: (id, payload) =>
    adminRequest(
      {
        url: `/catalog/products/${id}/inventory`,
        method: "PATCH",
        data: payload
      },
      "Unable to update inventory"
    ),
  restockProduct: (id, payload) =>
    adminRequest(
      {
        url: `/catalog/products/${id}/restock`,
        method: "POST",
        data: payload
      },
      "Unable to restock product"
    ),
  listCategories: () =>
    adminRequest(
      {
        url: "/catalog/categories",
        method: "GET"
      },
      "Unable to load categories"
    ),
  createCategory: (payload) =>
    adminRequest(
      {
        url: "/catalog/categories",
        method: "POST",
        data: payload
      },
      "Unable to create category"
    ),
  updateCategory: (id, payload) =>
    adminRequest(
      {
        url: `/catalog/categories/${id}`,
        method: "PATCH",
        data: payload
      },
      "Unable to update category"
    ),
  deleteCategory: (id) =>
    adminRequest(
      {
        url: `/catalog/categories/${id}`,
        method: "DELETE"
      },
      "Unable to delete category"
    )
};

export const adminOrdersApi = {
  list: (params) =>
    adminRequest(
      {
        url: "/orders",
        method: "GET",
        params
      },
      "Unable to load orders"
    ),
  detail: (id) =>
    adminRequest(
      {
        url: `/orders/${id}`,
        method: "GET"
      },
      "Unable to load order"
    ),
  updateStatus: (id, payload) =>
    adminRequest(
      {
        url: `/orders/${id}/status`,
        method: "PATCH",
        data: payload
      },
      "Unable to update order"
    ),
  refund: (id, payload) =>
    adminRequest(
      {
        url: `/orders/${id}/cancel-or-refund`,
        method: "POST",
        data: payload
      },
      "Unable to process refund"
    ),
  invoice: (id) =>
    adminRequest(
      {
        url: `/orders/${id}/invoice`,
        method: "GET"
      },
      "Unable to load invoice"
    )
};

export const adminCustomersApi = {
  list: (params) =>
    adminRequest(
      {
        url: "/customers",
        method: "GET",
        params
      },
      "Unable to load customers"
    ),
  history: (id) =>
    adminRequest(
      {
        url: `/customers/${id}/orders`,
        method: "GET"
      },
      "Unable to load customer history"
    ),
  block: (id) =>
    adminRequest(
      {
        url: `/customers/${id}/block`,
        method: "PATCH"
      },
      "Unable to block customer"
    ),
  unblock: (id) =>
    adminRequest(
      {
        url: `/customers/${id}/unblock`,
        method: "PATCH"
      },
      "Unable to unblock customer"
    )
};

export const adminCouponsApi = {
  list: () =>
    adminRequest(
      {
        url: "/coupons",
        method: "GET"
      },
      "Unable to load coupons"
    ),
  create: (payload) =>
    adminRequest(
      {
        url: "/coupons",
        method: "POST",
        data: payload
      },
      "Unable to create coupon"
    ),
  update: (id, payload) =>
    adminRequest(
      {
        url: `/coupons/${id}`,
        method: "PATCH",
        data: payload
      },
      "Unable to update coupon"
    ),
  remove: (id) =>
    adminRequest(
      {
        url: `/coupons/${id}`,
        method: "DELETE"
      },
      "Unable to delete coupon"
    )
};

export const adminReviewsApi = {
  list: () =>
    adminRequest(
      {
        url: "/reviews",
        method: "GET"
      },
      "Unable to load reviews"
    ),
  approve: (id) =>
    adminRequest(
      {
        url: `/reviews/${id}/approve`,
        method: "PATCH"
      },
      "Unable to approve review"
    ),
  reject: (id) =>
    adminRequest(
      {
        url: `/reviews/${id}/reject`,
        method: "PATCH"
      },
      "Unable to reject review"
    ),
  remove: (id) =>
    adminRequest(
      {
        url: `/reviews/${id}`,
        method: "DELETE"
      },
      "Unable to delete review"
    )
};

export const adminNotificationsApi = {
  list: () =>
    adminRequest(
      {
        url: "/notifications",
        method: "GET"
      },
      "Unable to load notifications"
    ),
  markRead: (id) =>
    adminRequest(
      {
        url: `/notifications/${id}/read`,
        method: "PATCH"
      },
      "Unable to mark notification as read"
    ),
  generate: () =>
    adminRequest(
      {
        url: "/notifications/generate",
        method: "POST"
      },
      "Unable to generate notifications"
    )
};

export const adminReportsApi = {
  revenue: () =>
    adminRequest(
      {
        url: "/reports/revenue",
        method: "GET"
      },
      "Unable to load revenue report"
    ),
  sales: () =>
    adminRequest(
      {
        url: "/reports/sales",
        method: "GET"
      },
      "Unable to load sales report"
    ),
  productPerformance: () =>
    adminRequest(
      {
        url: "/reports/product-performance",
        method: "GET"
      },
      "Unable to load product performance"
    ),
  userGrowth: () =>
    adminRequest(
      {
        url: "/reports/user-growth",
        method: "GET"
      },
      "Unable to load user growth"
    )
};

export const adminSettingsApi = {
  list: (group) =>
    adminRequest(
      {
        url: "/settings",
        method: "GET",
        params: group ? { group } : undefined
      },
      "Unable to load settings"
    ),
  save: (group, payload) =>
    adminRequest(
      {
        url: `/settings/${group}`,
        method: "PUT",
        data: payload
      },
      "Unable to save settings"
    )
};
