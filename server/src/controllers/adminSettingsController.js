import { asyncHandler } from "../middleware/asyncHandler.js";
import { settingsService } from "../services/admin/settingsService.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = req.query.group
    ? await settingsService.getByGroup(req.query.group)
    : await settingsService.getAll();
  apiSuccess(res, { settings });
});

export const saveAdminSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.saveGroup(req.params.group, req.body);
  apiSuccess(res, { message: "Settings saved", settings });
});
