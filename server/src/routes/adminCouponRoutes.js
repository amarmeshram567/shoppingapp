import express from "express";
import {
  createAdminCoupon,
  deleteAdminCoupon,
  listAdminCoupons,
  updateAdminCoupon,
  validateAdminCoupon
} from "../controllers/adminCouponController.js";
import { audit } from "../middleware/auditMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { couponSchema } from "../validators/adminSchemas.js";

const router = express.Router();

router.get("/", listAdminCoupons);
router.post("/", validateRequest(couponSchema), audit("create_coupon", "coupon"), createAdminCoupon);
router.post("/validate", validateAdminCoupon);
router.patch("/:id", audit("update_coupon", "coupon"), updateAdminCoupon);
router.delete("/:id", audit("delete_coupon", "coupon"), deleteAdminCoupon);

export default router;
