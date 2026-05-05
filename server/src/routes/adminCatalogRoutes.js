import express from "express";
import multer from "multer";
import {
  createAdminCategory,
  createAdminProduct,
  deleteAdminCategory,
  deleteAdminProduct,
  listAdminCategories,
  listAdminProducts,
  restockAdminProduct,
  updateAdminCategory,
  updateAdminInventory,
  updateAdminProduct
} from "../controllers/adminCatalogController.js";
import { audit } from "../middleware/auditMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { categorySchema, productCreateSchema } from "../validators/adminSchemas.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/products", listAdminProducts);
router.post("/products", upload.array("images", 10), validateRequest(productCreateSchema), audit("create_product", "product"), createAdminProduct);
router.patch("/products/:id", audit("update_product", "product"), updateAdminProduct);
router.delete("/products/:id", audit("delete_product", "product"), deleteAdminProduct);
router.patch("/products/:id/inventory", audit("update_inventory", "product"), updateAdminInventory);
router.post("/products/:id/restock", audit("restock_product", "product"), restockAdminProduct);

router.get("/categories", listAdminCategories);
router.post("/categories", validateRequest(categorySchema), audit("create_category", "category"), createAdminCategory);
router.patch("/categories/:id", audit("update_category", "category"), updateAdminCategory);
router.delete("/categories/:id", audit("delete_category", "category"), deleteAdminCategory);

export default router;
