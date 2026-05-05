import express from "express";
import adminAuthRoutes from "./adminAuthRoutes.js";
import adminDashboardRoutes from "./adminDashboardRoutes.js";
import adminCatalogRoutes from "./adminCatalogRoutes.js";
import adminOrderRoutes from "./adminOrderRoutes.js";
import adminCustomerRoutes from "./adminCustomerRoutes.js";
import adminCouponRoutes from "./adminCouponRoutes.js";
import adminReviewRoutes from "./adminReviewRoutes.js";
import adminNotificationRoutes from "./adminNotificationRoutes.js";
import adminReportRoutes from "./adminReportRoutes.js";
import adminSettingsRoutes from "./adminSettingsRoutes.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use("/auth", adminAuthRoutes);
router.use(protectAdmin);
router.use("/dashboard", adminDashboardRoutes);
router.use("/catalog", adminCatalogRoutes);
router.use("/orders", adminOrderRoutes);
router.use("/customers", adminCustomerRoutes);
router.use("/coupons", adminCouponRoutes);
router.use("/reviews", adminReviewRoutes);
router.use("/notifications", adminNotificationRoutes);
router.use("/reports", adminReportRoutes);
router.use("/settings", adminSettingsRoutes);

export default router;
