import express from "express";
import {
  getCurrentUser,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  syncClerkUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/clerk", syncClerkUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);

export default router;
