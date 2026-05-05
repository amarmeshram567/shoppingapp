import express from "express";
import {
  cancelOrRefundAdminOrder,
  generateAdminInvoice,
  getAdminOrder,
  listAdminOrders,
  updateAdminOrderStatus
} from "../controllers/adminOrderController.js";
import { audit } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", listAdminOrders);
router.get("/:id", getAdminOrder);
router.patch("/:id/status", audit("update_order_status", "order"), updateAdminOrderStatus);
router.post("/:id/cancel-or-refund", audit("cancel_or_refund_order", "order"), cancelOrRefundAdminOrder);
router.get("/:id/invoice", generateAdminInvoice);

export default router;
