import { asyncHandler } from "../middleware/asyncHandler.js";
import { catalogService } from "../services/admin/catalogService.js";
import { uploadService } from "../services/admin/uploadService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const createAdminProduct = asyncHandler(async (req, res) => {
  const uploads = req.files?.length ? await uploadService.uploadMultiple(req.files) : [];
  const product = await catalogService.createProduct(
    { ...req.validated.body, images: uploads.map((item) => item.url) },
    uploads,
    req.user._id
  );
  apiSuccess(res, { message: "Product created", product }, 201);
});

export const listAdminProducts = asyncHandler(async (req, res) => {
  const result = await catalogService.listProducts(req.query);
  apiSuccess(res, result);
});

export const updateAdminProduct = asyncHandler(async (req, res) => {
  const product = await catalogService.updateProduct(req.params.id, req.body);
  apiSuccess(res, { message: "Product updated", product });
});

export const deleteAdminProduct = asyncHandler(async (req, res) => {
  await catalogService.deleteProduct(req.params.id);
  apiSuccess(res, { message: "Product deleted" });
});

export const updateAdminInventory = asyncHandler(async (req, res) => {
  const product = await catalogService.updateInventory({
    productId: req.params.id,
    quantity: req.body.quantity,
    note: req.body.note,
    actorId: req.user._id
  });
  apiSuccess(res, { message: "Inventory updated", product });
});

export const restockAdminProduct = asyncHandler(async (req, res) => {
  const product = await catalogService.restockProduct({
    productId: req.params.id,
    quantity: req.body.quantity,
    note: req.body.note,
    actorId: req.user._id
  });
  apiSuccess(res, { message: "Product restocked", product });
});

export const createAdminCategory = asyncHandler(async (req, res) => {
  const category = await catalogService.createCategory(req.validated.body);
  apiSuccess(res, { message: "Category created", category }, 201);
});

export const listAdminCategories = asyncHandler(async (req, res) => {
  const categories = await catalogService.listCategories();
  apiSuccess(res, { categories });
});

export const updateAdminCategory = asyncHandler(async (req, res) => {
  const category = await catalogService.updateCategory(req.params.id, req.body);
  apiSuccess(res, { message: "Category updated", category });
});

export const deleteAdminCategory = asyncHandler(async (req, res) => {
  await catalogService.deleteCategory(req.params.id);
  apiSuccess(res, { message: "Category deleted" });
});
