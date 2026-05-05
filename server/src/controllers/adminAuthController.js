import { asyncHandler } from "../middleware/asyncHandler.js";
import { authService } from "../services/admin/authService.js";
import { setAuthCookie } from "../utils/generateToken.js";
import { apiSuccess } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export const adminLogin = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.validated.body);
  setAuthCookie(res, token);
  apiSuccess(res, { message: "Admin login successful", token, user });
});

export const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName);
  apiSuccess(res, { message: "Admin logout successful" });
});

export const adminForgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.validated.body);
  apiSuccess(res, result);
});

export const adminResetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.validated.body);
  apiSuccess(res, result);
});

export const adminMe = asyncHandler(async (req, res) => {
  apiSuccess(res, { user: req.user });
});
