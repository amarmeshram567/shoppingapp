import express from "express";
import {
  createProduct,
  createReview,
  deleteProduct,
  getFeaturedProducts,
  getProductBySlugOrId,
  getProductFilters,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/filters", getProductFilters);
router.post("/", protect, adminOnly, createProduct);
router.post("/:id/reviews", protect, createReview);
router.patch("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.get("/:idOrSlug", getProductBySlugOrId);

export default router;
