import express from "express";
import {
  generateAdminNotifications,
  listAdminNotifications,
  markAdminNotificationRead
} from "../controllers/adminNotificationController.js";

const router = express.Router();

router.get("/", listAdminNotifications);
router.post("/generate", generateAdminNotifications);
router.patch("/:id/read", markAdminNotificationRead);

export default router;
