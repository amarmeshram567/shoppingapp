import express from "express";
import {
  approveAdminReview,
  deleteAdminReview,
  listAdminReviews,
  rejectAdminReview
} from "../controllers/adminReviewController.js";
import { audit } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", listAdminReviews);
router.patch("/:id/approve", audit("approve_review", "review"), approveAdminReview);
router.patch("/:id/reject", audit("reject_review", "review"), rejectAdminReview);
router.delete("/:id", audit("delete_review", "review"), deleteAdminReview);

export default router;
