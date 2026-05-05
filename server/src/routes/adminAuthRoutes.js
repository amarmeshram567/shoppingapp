import express from "express";
import {
  adminForgotPassword,
  adminLogin,
  adminLogout,
  adminMe,
  adminResetPassword
} from "../controllers/adminAuthController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { adminLoginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/adminSchemas.js";
import { authRateLimit } from "../middleware/securityMiddleware.js";

const router = express.Router();

router.post("/login", authRateLimit, validateRequest(adminLoginSchema), adminLogin);
router.post("/forgot-password", authRateLimit, validateRequest(forgotPasswordSchema), adminForgotPassword);
router.post("/reset-password", authRateLimit, validateRequest(resetPasswordSchema), adminResetPassword);
router.post("/logout", protectAdmin, adminLogout);
router.get("/me", protectAdmin, adminMe);

export default router;
