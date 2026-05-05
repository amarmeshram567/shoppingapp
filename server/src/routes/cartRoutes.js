import express from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getCart).post(addCartItem).delete(clearCart);
router.patch("/:itemId", updateCartItem);
router.delete("/:itemId", removeCartItem);

export default router;
