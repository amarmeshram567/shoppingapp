import { adminMockData } from "./adminMockData";

export const formatMonthLabel = (value) => {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    return new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", {
      month: "short"
    });
  }

  if (value.year && value.month) {
    return new Date(value.year, value.month - 1, 1).toLocaleString("en-US", {
      month: "short"
    });
  }

  return String(value);
};

export const mapProduct = (product) => ({
  id: product._id || product.id,
  name: product.name,
  sku: product.sku || product.skuPrefix || "N/A",
  categoryId: product.categoryRef?._id || product.categoryRef || "",
  category: product.categoryRef?.name || product.category || "Uncategorized",
  brand: product.brand || "",
  price: product.price || 0,
  compareAtPrice: product.originalPrice || 0,
  inventory: product.stockQuantity ?? 0,
  status: product.inStock ? "active" : "draft",
  variants: Array.isArray(product.variants) ? product.variants.length : 0,
  description: product.description || "",
  image: product.image || "",
  images: product.images || [],
  lowStockThreshold: product.lowStockThreshold ?? 5,
  featured: Boolean(product.featured)
});

export const mapCategory = (category, allCategories = []) => ({
  id: category._id || category.id,
  name: category.name,
  slug: category.slug,
  parentId: category.parent?._id || category.parent || "",
  image: category.image || "",
  description: category.description || "",
  isActive: category.isActive ?? true,
  children: allCategories
    .filter((item) => String(item.parent?._id || item.parent || "") === String(category._id || category.id))
    .map((item) => item.name)
});

const titleCase = (value = "") =>
  String(value)
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const mapOrder = (order) => ({
  id: order._id || order.id,
  customer:
    order.user?.name ||
    [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") ||
    order.shippingAddress?.fullName ||
    "Customer",
  email: order.user?.email || "",
  total: order.total || 0,
  items: order.items?.length || 0,
  status: titleCase(order.status),
  rawStatus: order.status,
  payment: titleCase(order.paymentMethod || order.paymentStatus || "pending"),
  paymentStatus: order.paymentStatus,
  fulfillment: titleCase(order.status),
  createdAt: order.createdAt,
  date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
  shippingAddress: [
    order.shippingAddress?.addressLine1,
    order.shippingAddress?.addressLine2,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.postalCode,
    order.shippingAddress?.country
  ]
    .filter(Boolean)
    .join(", "),
  timeline: order.timeline || [],
  invoiceNumber: order.invoiceNumber || "",
  source: order
});

export const mapCustomer = (customer) => ({
  id: customer._id || customer.id,
  name: customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer",
  email: customer.email,
  orders: customer.orders || 0,
  spent: customer.spent || 0,
  blocked: Boolean(customer.isBlocked ?? customer.blocked),
  segment: customer.segment || (customer.isBlocked ? "Restricted" : "Customer"),
  source: customer
});

export const enrichCustomersWithHistory = (customers, orders) => {
  const counts = new Map();
  const totals = new Map();

  orders.forEach((order) => {
    const id = String(order.user?._id || order.user || "");
    counts.set(id, (counts.get(id) || 0) + 1);
    totals.set(id, (totals.get(id) || 0) + Number(order.total || 0));
  });

  return customers.map((customer) => ({
    ...customer,
    orders: counts.get(String(customer.id)) || customer.orders || 0,
    spent: totals.get(String(customer.id)) || customer.spent || 0
  }));
};

export const mapCoupon = (coupon) => ({
  id: coupon._id || coupon.id,
  code: coupon.code,
  type: coupon.discountType,
  value: coupon.discountValue,
  minOrderValue: coupon.minimumOrderAmount || 0,
  usageLimit: coupon.usageLimit || 0,
  used: coupon.usedCount || 0,
  expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : "",
  active: coupon.active ?? true,
  description: coupon.description || "",
  maxDiscountAmount: coupon.maxDiscountAmount || 0
});

export const mapReview = (review) => ({
  id: review._id || review.id,
  product: review.product?.name || "Product",
  customer: review.user?.name || review.user?.email || "Customer",
  rating: review.rating,
  status: titleCase(review.status),
  rawStatus: review.status,
  excerpt: review.comment,
  title: review.title || "",
  createdAt: review.createdAt
});

export const mapNotification = (notification) => ({
  id: notification._id || notification.id,
  title: notification.title,
  body: notification.message,
  level:
    notification.type === "refund_request"
      ? "critical"
      : notification.type === "low_stock"
        ? "warning"
        : "success",
  read: Boolean(notification.isRead),
  time: notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Now",
  type: notification.type
});

export const mapSettings = (settings) => {
  const lookup = Object.fromEntries(
    settings.map((item) => [item.key, item.value])
  );

  return {
    taxRate: Number(lookup["tax.defaultRate"] ?? adminMockData.settings.taxRate),
    shippingFee: Number(lookup["shipping.flatCharge"] ?? adminMockData.settings.shippingFee),
    paymentGateway: String(lookup["payment.gateway"] ?? adminMockData.settings.paymentGateway),
    supportEmail: String(lookup["email.supportEmail"] ?? adminMockData.settings.supportEmail)
  };
};

export const mapDashboard = (data) => {
  const monthlySales = data.monthlySales || [];

  return {
    metrics: {
      totalRevenue: data.totals?.revenue || 0,
      totalOrders: data.totals?.orders || 0,
      totalCustomers: data.totals?.customers || 0,
      totalProducts: data.totals?.products || 0,
      revenueDelta: "Live",
      orderDelta: "Live",
      customerDelta: "Live",
      productDelta: "Live"
    },
    revenueSeries:
      data.revenueGraph?.map((item, index) => ({
        month: formatMonthLabel(item.label),
        revenue: item.revenue,
        target: Math.max(item.revenue * 0.85, monthlySales[index]?.totalSales || 0)
      })) || adminMockData.revenueSeries,
    salesSeries:
      monthlySales.slice(-6).map((item) => ({
        label: formatMonthLabel({ year: item._id.year, month: item._id.month }),
        sales: item.totalOrders
      })) || adminMockData.salesSeries,
    recentOrders: (data.recentOrders || []).map(mapOrder),
    lowStock: (data.lowStockAlerts || []).map((item) => ({
      id: item._id,
      name: item.name,
      sku: item.sku || item.skuPrefix || "N/A",
      stock: item.stockQuantity ?? 0,
      threshold: item.lowStockThreshold ?? 0
    }))
  };
};

export const mapRevenueReport = (rows) =>
  rows.map((row) => ({
    month: formatMonthLabel({ year: row._id.year, month: row._id.month }),
    revenue: row.revenue,
    target: Math.max(row.revenue * 0.85, 0),
    orders: row.orders
  }));

export const mapUserGrowthReport = (rows) =>
  rows.map((row) => ({
    month: formatMonthLabel({ year: row._id.year, month: row._id.month }),
    users: row.count
  }));
