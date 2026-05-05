import adminIndexRoutes from "./adminIndexRoutes.js";
import express from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import couponRoutes from "./couponRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "shoppingapp-api"
  });
});

router.use("/auth", authRoutes);
router.use("/admin-panel", adminIndexRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/coupons", couponRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
