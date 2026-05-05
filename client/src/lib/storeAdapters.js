export const normalizeProduct = (product) => ({
  id: product._id || product.id,
  name: product.name,
  slug: product.slug,
  brand: product.brand || "",
  category: product.category || product.categoryRef?.name || "",
  price: Number(product.price || 0),
  originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
  rating: Number(product.rating || 0),
  reviews: Number(product.reviews || 0),
  image: product.image,
  hoverImage: product.hoverImage || product.images?.[1] || product.image,
  images: product.images?.length ? product.images : [product.image].filter(Boolean),
  badge: product.badge || (product.featured ? "Bestseller" : product.originalPrice ? "Sale" : ""),
  colors: product.colors || [],
  sizes: product.sizes || [],
  inStock: Boolean(product.inStock),
  stockQuantity: Number(product.stockQuantity || 0),
  description: product.description || "",
  specs: product.specs || [],
  tags: product.tags || []
});

export const normalizeReview = (review) => ({
  id: review._id || review.id,
  name:
    review.user?.name ||
    [review.user?.firstName, review.user?.lastName].filter(Boolean).join(" ") ||
    "Customer",
  rating: review.rating,
  title: review.title || "",
  comment: review.comment || "",
  date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""
});

export const normalizeWishlistProducts = (wishlist = []) => wishlist.map(normalizeProduct);

export const normalizeCart = (cart) => ({
  items: (cart?.items || []).map((item) => ({
    id: item._id,
    productId: item.product?._id || item.product?.id,
    product: normalizeProduct(item.product || {}),
    quantity: item.quantity,
    color: item.color || "",
    size: item.size || ""
  })),
  summary: cart?.summary || {
    subtotal: 0,
    shippingFee: 0,
    tax: 0,
    total: 0
  }
});

export const normalizeOrder = (order) => ({
  id: order._id || order.id,
  date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
  createdAt: order.createdAt,
  total: Number(order.total || 0),
  status: String(order.status || "pending").replace(/\b\w/g, (char) => char.toUpperCase()),
  paymentMethod: order.paymentMethod || "",
  shippingAddress: order.shippingAddress || {},
  items: (order.items || []).map((item) => ({
    productId: item.product?._id || item.product,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    color: item.color || "",
    size: item.size || ""
  }))
});

export const normalizeUser = (user) => ({
  ...user,
  name: user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" "),
  wishlist: normalizeWishlistProducts(user?.wishlist || [])
});
