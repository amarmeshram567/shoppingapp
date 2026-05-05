import { asyncHandler } from "../middleware/asyncHandler.js";
import { reportService } from "../services/admin/reportService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const getRevenueReport = asyncHandler(async (req, res) => {
  const report = await reportService.revenueReport();
  apiSuccess(res, { report });
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const report = await reportService.salesReport();
  apiSuccess(res, { report });
});

export const getProductPerformanceReport = asyncHandler(async (req, res) => {
  const report = await reportService.productPerformance();
  apiSuccess(res, { report });
});

export const getUserGrowthReport = asyncHandler(async (req, res) => {
  const report = await reportService.userGrowthReport();
  apiSuccess(res, { report });
});

export const exportRevenueCsv = asyncHandler(async (req, res) => {
  const report = await reportService.revenueReport();
  const csv = await reportService.exportCsv(report);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="revenue-report.csv"');
  res.status(200).send(csv);
});
