import { asyncHandler } from "../middleware/asyncHandler.js";
import { reviewAdminService } from "../services/admin/reviewAdminService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const listAdminReviews = asyncHandler(async (req, res) => {
  const result = await reviewAdminService.listReviews(req.query);
  apiSuccess(res, result);
});

export const approveAdminReview = asyncHandler(async (req, res) => {
  const review = await reviewAdminService.moderateReview(req.params.id, "approved");
  apiSuccess(res, { message: "Review approved", review });
});

export const rejectAdminReview = asyncHandler(async (req, res) => {
  const review = await reviewAdminService.moderateReview(req.params.id, "rejected");
  apiSuccess(res, { message: "Review rejected", review });
});

export const deleteAdminReview = asyncHandler(async (req, res) => {
  await reviewAdminService.deleteReview(req.params.id);
  apiSuccess(res, { message: "Review deleted" });
});
