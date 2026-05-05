import crypto from "crypto";
import { userRepository } from "../../repositories/userRepository.js";
import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { ADMIN_ROLES, PRIVILEGED_ADMIN_ROLES } from "../../constants/roles.js";
import { normalizeEmail } from "../../utils/validators.js";
import { generateToken } from "../../utils/generateToken.js";
import { generateResetToken } from "../../utils/password.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const authService = {
  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || !PRIVILEGED_ADMIN_ROLES.includes(user.role)) {
      throw createHttpError("Invalid admin credentials", HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw createHttpError("Admin account is blocked", HTTP_STATUS.FORBIDDEN);
    }

    if (user.isLocked()) {
      throw createHttpError(
        "Account temporarily locked due to multiple failed attempts",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const matched = await user.matchPassword(password);
    if (!matched) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= env.adminLockMaxAttempts) {
        user.lockUntil = new Date(Date.now() + env.adminLockMinutes * 60 * 1000);
      }
      await user.save();
      throw createHttpError("Invalid admin credentials", HTTP_STATUS.UNAUTHORIZED);
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user,
      token: generateToken(user._id.toString())
    };
  },

  async forgotPassword({ email }) {
    const user = await userRepository.findByEmail(normalizeEmail(email));

    if (!user || !PRIVILEGED_ADMIN_ROLES.includes(user.role)) {
      return { message: "If the account exists, a reset token has been generated." };
    }

    const { rawToken, hashedToken } = generateResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + env.adminResetExpiresMinutes * 60 * 1000);
    await user.save();

    return {
      message: "Reset token generated",
      resetToken: rawToken
    };
  },

  async resetPassword({ token, password }) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await import("../../models/User.js").then(({ User }) =>
      User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() }
      })
    );

    if (!admin) {
      throw createHttpError("Invalid or expired reset token", HTTP_STATUS.BAD_REQUEST);
    }

    admin.password = password;
    admin.passwordResetToken = null;
    admin.passwordResetExpires = null;
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    return { message: "Password reset successful" };
  },

  async seedSuperAdmin() {
    const existing = await userRepository.findByEmail(normalizeEmail(env.adminDefaultEmail));
    if (existing) return existing;

    return userRepository.create({
      name: env.superAdminName,
      firstName: env.superAdminName,
      email: normalizeEmail(env.adminDefaultEmail),
      password: env.adminDefaultPassword,
      provider: "local",
      role: ADMIN_ROLES.SUPER_ADMIN
    });
  }
};
