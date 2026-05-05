import { productRepository } from "../../repositories/productRepository.js";
import { categoryRepository } from "../../repositories/categoryRepository.js";
import { stockMovementRepository } from "../../repositories/stockMovementRepository.js";
import { slugify } from "../../utils/slugify.js";
import { getPagination } from "../../utils/pagination.js";
import { STOCK_MOVEMENT_TYPES } from "../../constants/stock.js";

const generateSku = (name, index = 1) =>
  `${slugify(name).replace(/-/g, "").slice(0, 6).toUpperCase()}-${String(index).padStart(4, "0")}`;

export const catalogService = {
  async createProduct(payload, files, actorId) {
    const uploadedImages = files?.length ? files.map((file) => file.url || file.path || file.originalname) : [];
    const variants = (payload.variants || []).map((variant, index) => ({
      ...variant,
      sku: variant.sku || generateSku(payload.name, index + 1)
    }));

    const product = await productRepository.create({
      ...payload,
      slug: slugify(payload.slug || payload.name),
      skuPrefix: payload.skuPrefix || generateSku(payload.name, 0),
      image: uploadedImages[0] || payload.image,
      images: uploadedImages.length ? uploadedImages : payload.images || [],
      variants
    });

    await stockMovementRepository.create({
      product: product._id,
      type: STOCK_MOVEMENT_TYPES.MANUAL_ADJUSTMENT,
      quantity: product.stockQuantity,
      previousStock: 0,
      newStock: product.stockQuantity,
      note: "Initial product stock",
      actor: actorId
    });

    return product;
  },

  async listProducts(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.search) {
      filter.$text = { $search: query.search };
    }
    if (query.category) {
      filter.category = new RegExp(`^${query.category}$`, "i");
    }
    if (query.brand) {
      filter.brand = new RegExp(`^${query.brand}$`, "i");
    }
    if (query.inStock === "true") {
      filter.inStock = true;
    }

    const [items, total] = await Promise.all([
      productRepository.findMany(filter, { skip, limit, sort: { createdAt: -1 } }),
      productRepository.count(filter)
    ]);

    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  },

  async updateProduct(id, payload) {
    if (payload.slug || payload.name) {
      payload.slug = slugify(payload.slug || payload.name);
    }
    return productRepository.updateById(id, payload);
  },

  async deleteProduct(id) {
    return productRepository.deleteById(id);
  },

  async updateInventory({ productId, quantity, note, actorId }) {
    const product = await productRepository.findById(productId);
    if (!product) throw new Error("Product not found");

    const previousStock = product.stockQuantity;
    product.stockQuantity = Math.max(0, Number(quantity));
    product.inStock = product.stockQuantity > 0;
    await product.save();

    await stockMovementRepository.create({
      product: product._id,
      type: STOCK_MOVEMENT_TYPES.MANUAL_ADJUSTMENT,
      quantity: product.stockQuantity - previousStock,
      previousStock,
      newStock: product.stockQuantity,
      note: note || "Inventory updated",
      actor: actorId
    });

    return product;
  },

  async restockProduct({ productId, quantity, note, actorId }) {
    const product = await productRepository.findById(productId);
    if (!product) throw new Error("Product not found");

    const restockQty = Math.max(1, Number(quantity));
    const previousStock = product.stockQuantity;
    product.stockQuantity += restockQty;
    product.inStock = true;
    await product.save();

    await stockMovementRepository.create({
      product: product._id,
      type: STOCK_MOVEMENT_TYPES.RESTOCK,
      quantity: restockQty,
      previousStock,
      newStock: product.stockQuantity,
      note: note || "Product restocked",
      actor: actorId
    });

    return product;
  },

  async createCategory(payload) {
    return categoryRepository.create({
      ...payload,
      slug: slugify(payload.slug || payload.name)
    });
  },

  async listCategories() {
    return categoryRepository.findAll();
  },

  async updateCategory(id, payload) {
    if (payload.slug || payload.name) {
      payload.slug = slugify(payload.slug || payload.name);
    }
    return categoryRepository.updateById(id, payload);
  },

  async deleteCategory(id) {
    return categoryRepository.deleteById(id);
  }
};
