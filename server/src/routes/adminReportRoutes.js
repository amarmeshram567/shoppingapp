import express from "express";
import {
  exportRevenueCsv,
  getProductPerformanceReport,
  getRevenueReport,
  getSalesReport,
  getUserGrowthReport
} from "../controllers/adminReportController.js";

const router = express.Router();

router.get("/revenue", getRevenueReport);
router.get("/sales", getSalesReport);
router.get("/product-performance", getProductPerformanceReport);
router.get("/user-growth", getUserGrowthReport);
router.get("/revenue/export.csv", exportRevenueCsv);

export default router;
