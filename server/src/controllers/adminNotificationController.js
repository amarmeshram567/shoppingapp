import { asyncHandler } from "../middleware/asyncHandler.js";
import { notificationService } from "../services/admin/notificationService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const listAdminNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.listNotifications(req.query);
  apiSuccess(res, result);
});

export const generateAdminNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.generateSystemAlerts();
  apiSuccess(res, { message: "Notifications generated", notifications });
});

export const markAdminNotificationRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.params.id);
  apiSuccess(res, { message: "Notification marked read", notification });
});
