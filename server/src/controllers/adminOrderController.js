import { asyncHandler } from "../middleware/asyncHandler.js";
import { orderAdminService } from "../services/admin/orderAdminService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const listAdminOrders = asyncHandler(async (req, res) => {
  const result = await orderAdminService.listOrders(req.query);
  apiSuccess(res, result);
});

export const getAdminOrder = asyncHandler(async (req, res) => {
  const order = await orderAdminService.getOrder(req.params.id);
  apiSuccess(res, { order });
});

export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderAdminService.updateStatus(req.params.id, req.body, req.user._id);
  apiSuccess(res, { message: "Order status updated", order });
});

export const cancelOrRefundAdminOrder = asyncHandler(async (req, res) => {
  const order = await orderAdminService.cancelOrRefund(req.params.id, req.body, req.user._id);
  apiSuccess(res, { message: "Order action completed", order });
});

export const generateAdminInvoice = asyncHandler(async (req, res) => {
  const invoice = await orderAdminService.generateInvoice(req.params.id);
  apiSuccess(res, invoice);
});
