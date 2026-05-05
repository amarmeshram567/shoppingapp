import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { asyncHandler } from "./asyncHandler.js";
import { PRIVILEGED_ADMIN_ROLES } from "../constants/roles.js";

export const protect = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = req.cookies[env.cookieName] || bearerToken;

  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error("Not authorized");
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error("User no longer exists");
  }

  if (user.isBlocked) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error("User account is blocked");
  }

  req.user = user;
  next();
});

export const adminOnly = (req, res, next) => {
  if (!PRIVILEGED_ADMIN_ROLES.includes(req.user?.role)) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error("Admin access required");
  }

  next();
};

export const protectAdmin = [protect, adminOnly];

export const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error("Insufficient permissions");
  }
  next();
};
