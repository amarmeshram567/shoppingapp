import { asyncHandler } from "../middleware/asyncHandler.js";
import { dashboardService } from "../services/admin/dashboardService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStats();
  apiSuccess(res, data);
});
