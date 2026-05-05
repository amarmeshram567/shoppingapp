import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(createOrder).get(getMyOrders);
router.get("/admin/all", adminOnly, getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", adminOnly, updateOrderStatus);

export default router;
