import express from "express";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";

const router = express.Router();
router.get("/", getAdminDashboard);
export default router;
