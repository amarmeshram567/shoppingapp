import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon
} from "../controllers/couponController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate", validateCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.post("/", protect, adminOnly, createCoupon);
router.patch("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;
