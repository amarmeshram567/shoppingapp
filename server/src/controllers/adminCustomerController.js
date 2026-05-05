import { asyncHandler } from "../middleware/asyncHandler.js";
import { customerService } from "../services/admin/customerService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const listAdminCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(req.query);
  apiSuccess(res, result);
});

export const blockAdminCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.setBlockStatus(req.params.id, true);
  apiSuccess(res, { message: "Customer blocked", customer });
});

export const unblockAdminCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.setBlockStatus(req.params.id, false);
  apiSuccess(res, { message: "Customer unblocked", customer });
});

export const getAdminCustomerHistory = asyncHandler(async (req, res) => {
  const result = await customerService.getCustomerHistory(req.params.id);
  apiSuccess(res, result);
});
