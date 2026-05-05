import express from "express";
import { getAdminSettings, saveAdminSettings } from "../controllers/adminSettingsController.js";
import { audit } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", getAdminSettings);
router.put("/:group", audit("save_settings", "setting"), saveAdminSettings);

export default router;
