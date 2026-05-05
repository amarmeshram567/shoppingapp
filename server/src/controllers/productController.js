import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { getPagination } from "../utils/pagination.js";
import { clampNumber, isValidObjectId, toBoolean } from "../utils/validators.js";
import { slugify } from "../utils/slugify.js";

const getSortMap = (sort) => ({
  featured: { featured: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1, reviews: -1 },
  popular: { reviews: -1, rating: -1 }
}[sort] || { featured: -1, createdAt: -1 });

export const getProducts = asyncHandler(async (req, res) => {
  const {
    q = "",
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    featured,
    inStock,
    sort = "featured"
  } = req.query;

  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (category) {
    filter.category = new RegExp(`^${category}$`, "i");
  }

  if (brand) {
    filter.brand = new RegExp(`^${brand}$`, "i");
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  if (minRating !== undefined) {
    filter.rating = { $gte: clampNumber(minRating, 0, 5, 0) };
  }

  const featuredBool = toBoolean(featured);
  if (featuredBool !== undefined) {
    filter.featured = featuredBool;
  }

  const inStockBool = toBoolean(inStock);
  if (inStockBool !== undefined) {
    filter.inStock = inStockBool;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort(getSortMap(sort)).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ]);

  res.status(HTTP_STATUS.OK).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = clampNumber(req.query.limit, 1, 20, 8);
  const products = await Product.find({ featured: true }).limit(limit).sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({ products });
});

export const getProductBySlugOrId = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  const product =
    (isValidObjectId(idOrSlug) ? await Product.findById(idOrSlug) : null) ||
    (await Product.findOne({ slug: idOrSlug }));

  if (!product) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Product not found");
  }

  const reviews = await Review.find({ product: product._id })
    .populate("user", "firstName lastName name avatar")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({ product, reviews });
});

export const getProductFilters = asyncHandler(async (req, res) => {
  const [brands, categories, priceRange] = await Promise.all([
    Product.distinct("brand"),
    Product.distinct("category"),
    Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ])
  ]);

  res.status(HTTP_STATUS.OK).json({
    brands,
    categories,
    minPrice: priceRange[0]?.minPrice ?? 0,
    maxPrice: priceRange[0]?.maxPrice ?? 0
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  payload.slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);

  const product = await Product.create(payload);
  res.status(HTTP_STATUS.CREATED).json({
    message: "Product created",
    product
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  if (req.body.slug || req.body.name) {
    product.slug = slugify(req.body.slug || req.body.name);
  }

  await product.save();

  res.status(HTTP_STATUS.OK).json({
    message: "Product updated",
    product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.status(HTTP_STATUS.OK).json({ message: "Product deleted" });
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, title = "" } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Invalid product id");
  }

  const product = await Product.findById(id);
  if (!product) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error("Product not found");
  }

  if (!rating || !comment) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Rating and comment are required");
  }

  const hasPurchased = await Order.exists({
    user: req.user._id,
    "items.product": product._id
  });

  const review = await Review.findOneAndUpdate(
    { product: product._id, user: req.user._id },
    {
      product: product._id,
      user: req.user._id,
      rating: clampNumber(rating, 1, 5, 5),
      title,
      comment,
      isVerifiedPurchase: Boolean(hasPurchased)
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  product.rating = Number((stats[0]?.avgRating || 0).toFixed(1));
  product.reviews = stats[0]?.totalReviews || 0;
  await product.save();

  res.status(HTTP_STATUS.CREATED).json({
    message: "Review saved",
    review
  });
});
