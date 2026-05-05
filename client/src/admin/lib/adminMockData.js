export const adminMockData = {
  metrics: {
    totalRevenue: 248960,
    totalOrders: 1842,
    totalCustomers: 912,
    totalProducts: 386,
    revenueDelta: "+14.2%",
    orderDelta: "+7.9%",
    customerDelta: "+11.3%",
    productDelta: "+5.1%"
  },
  revenueSeries: [
    { month: "Jan", revenue: 32000, target: 28000 },
    { month: "Feb", revenue: 36500, target: 30000 },
    { month: "Mar", revenue: 41200, target: 34000 },
    { month: "Apr", revenue: 44500, target: 36000 },
    { month: "May", revenue: 50200, target: 39000 },
    { month: "Jun", revenue: 54560, target: 42000 }
  ],
  salesSeries: [
    { label: "Apparel", sales: 420 },
    { label: "Footwear", sales: 310 },
    { label: "Beauty", sales: 260 },
    { label: "Home", sales: 180 },
    { label: "Accessories", sales: 240 }
  ],
  lowStock: [
    { id: "p1", name: "Luna Knit Blazer", sku: "LK-223", stock: 4, threshold: 8 },
    { id: "p2", name: "Aurum Desk Lamp", sku: "AL-911", stock: 2, threshold: 6 },
    { id: "p3", name: "Terra Bottle Set", sku: "TB-104", stock: 7, threshold: 10 }
  ],
  recentOrders: [
    { id: "SO-1042", customer: "Ava Thompson", total: 420, status: "Paid", date: "2026-05-01" },
    { id: "SO-1041", customer: "Mason Carter", total: 199, status: "Packed", date: "2026-05-01" },
    { id: "SO-1040", customer: "Olivia Smith", total: 560, status: "Refund Requested", date: "2026-04-30" },
    { id: "SO-1039", customer: "Liam Walker", total: 142, status: "Delivered", date: "2026-04-30" }
  ],
  products: [
    {
      id: "p1",
      name: "Luna Knit Blazer",
      sku: "LK-223",
      categoryId: "c1",
      category: "Apparel",
      price: 149,
      compareAtPrice: 199,
      inventory: 12,
      status: "active",
      variants: 4,
      description: "<p>Structured knit blazer with soft drape and tonal buttons.</p>"
    },
    {
      id: "p2",
      name: "Aurum Desk Lamp",
      sku: "AL-911",
      categoryId: "c2",
      category: "Home",
      price: 89,
      compareAtPrice: 119,
      inventory: 3,
      status: "draft",
      variants: 2,
      description: "<p>Brushed brass lamp with warm diffuse lighting.</p>"
    },
    {
      id: "p3",
      name: "Aster Travel Case",
      sku: "AT-008",
      categoryId: "c3",
      category: "Accessories",
      price: 54,
      compareAtPrice: 64,
      inventory: 38,
      status: "active",
      variants: 3,
      description: "<p>Modular travel case with detachable organizers.</p>"
    }
  ],
  categories: [
    { id: "c1", name: "Apparel", slug: "apparel", parentId: "", image: "", children: ["Tailoring", "Outerwear"] },
    { id: "c2", name: "Home", slug: "home", parentId: "", image: "", children: ["Lighting", "Decor"] },
    { id: "c3", name: "Accessories", slug: "accessories", parentId: "", image: "", children: ["Travel", "Bags"] }
  ],
  orders: [
    {
      id: "SO-1042",
      customer: "Ava Thompson",
      email: "ava@example.com",
      total: 420,
      items: 3,
      status: "Paid",
      payment: "Stripe",
      fulfillment: "Processing",
      createdAt: "2026-05-01T10:20:00Z",
      shippingAddress: "22 Mercer Street, New York"
    },
    {
      id: "SO-1041",
      customer: "Mason Carter",
      email: "mason@example.com",
      total: 199,
      items: 1,
      status: "Packed",
      payment: "Razorpay",
      fulfillment: "Packed",
      createdAt: "2026-05-01T08:42:00Z",
      shippingAddress: "47 King Road, Austin"
    },
    {
      id: "SO-1040",
      customer: "Olivia Smith",
      email: "olivia@example.com",
      total: 560,
      items: 4,
      status: "Refund Requested",
      payment: "COD",
      fulfillment: "Delivered",
      createdAt: "2026-04-30T15:05:00Z",
      shippingAddress: "9 Lake View, Seattle"
    }
  ],
  customers: [
    { id: "u1", name: "Ava Thompson", email: "ava@example.com", orders: 14, spent: 2480, blocked: false, segment: "VIP" },
    { id: "u2", name: "Mason Carter", email: "mason@example.com", orders: 7, spent: 920, blocked: false, segment: "Repeat" },
    { id: "u3", name: "Olivia Smith", email: "olivia@example.com", orders: 2, spent: 640, blocked: true, segment: "At Risk" }
  ],
  coupons: [
    { id: "cp1", code: "SPRING15", type: "percentage", value: 15, minOrderValue: 100, usageLimit: 200, used: 118, expiresAt: "2026-06-30" },
    { id: "cp2", code: "FREESHIP", type: "fixed", value: 25, minOrderValue: 80, usageLimit: 500, used: 302, expiresAt: "2026-05-31" }
  ],
  reviews: [
    { id: "r1", product: "Luna Knit Blazer", customer: "Ava Thompson", rating: 5, status: "Pending", excerpt: "Beautiful tailoring and fit." },
    { id: "r2", product: "Aurum Desk Lamp", customer: "Mason Carter", rating: 4, status: "Approved", excerpt: "Looks premium on the desk." },
    { id: "r3", product: "Aster Travel Case", customer: "Noah Reed", rating: 2, status: "Pending", excerpt: "Expected a larger organizer." }
  ],
  notifications: [
    { id: "n1", title: "Low stock threshold breached", body: "Aurum Desk Lamp has only 2 units left.", level: "warning", read: false, time: "2m ago" },
    { id: "n2", title: "Refund requested", body: "Order SO-1040 needs approval.", level: "critical", read: false, time: "14m ago" },
    { id: "n3", title: "Revenue milestone", body: "Monthly revenue crossed $50k.", level: "success", read: true, time: "1h ago" }
  ],
  reports: {
    topProducts: [
      { label: "Luna Knit Blazer", value: 124 },
      { label: "Aster Travel Case", value: 98 },
      { label: "Aurum Desk Lamp", value: 74 },
      { label: "Verve Chair", value: 66 }
    ],
    userGrowth: [
      { month: "Jan", users: 110 },
      { month: "Feb", users: 140 },
      { month: "Mar", users: 168 },
      { month: "Apr", users: 205 },
      { month: "May", users: 228 },
      { month: "Jun", users: 261 }
    ]
  },
  inventoryHistory: [
    { id: "s1", sku: "LK-223", action: "Restock", quantity: 20, actor: "Priya", createdAt: "2026-05-01" },
    { id: "s2", sku: "AL-911", action: "Adjustment", quantity: -3, actor: "Marco", createdAt: "2026-04-29" }
  ],
  cmsBlocks: [
    { id: "b1", name: "Hero banner", status: "Published", updatedAt: "2026-04-28" },
    { id: "b2", name: "Promo strip", status: "Draft", updatedAt: "2026-04-30" },
    { id: "b3", name: "Landing spotlight", status: "Published", updatedAt: "2026-05-01" }
  ],
  settings: {
    taxRate: 0.08,
    shippingFee: 25,
    paymentGateway: "Stripe",
    supportEmail: "ops@shoppingapp.com"
  }
};
