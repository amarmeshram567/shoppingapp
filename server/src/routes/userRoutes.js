import express from "express";
import {
  addAddress,
  addPaymentMethod,
  deleteUser,
  deleteAddress,
  deletePaymentMethod,
  getAllUsers,
  getProfile,
  getUserById,
  getWishlist,
  toggleWishlist,
  updateAddress,
  updateProfile,
  updateUserRole
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.post("/me/addresses", addAddress);
router.patch("/me/addresses/:addressId", updateAddress);
router.delete("/me/addresses/:addressId", deleteAddress);
router.post("/me/payment-methods", addPaymentMethod);
router.delete("/me/payment-methods/:paymentMethodId", deletePaymentMethod);
router.get("/wishlist", getWishlist);
router.post("/wishlist/toggle", toggleWishlist);

router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getUserById);
router.patch("/:id/role", adminOnly, updateUserRole);
router.delete("/:id", adminOnly, deleteUser);

export default router;
