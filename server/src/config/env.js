import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "https://shoppingapp-v32b.vercel.app",
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "development_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
  cookieName: process.env.COOKIE_NAME || "shoppingapp_token",
  freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD) || 500,
  defaultShippingFee: Number(process.env.DEFAULT_SHIPPING_FEE) || 25,
  taxRate: Number(process.env.TAX_RATE) || 0.08,
  adminLockMaxAttempts: Number(process.env.ADMIN_LOCK_MAX_ATTEMPTS) || 5,
  adminLockMinutes: Number(process.env.ADMIN_LOCK_MINUTES) || 30,
  adminResetExpiresMinutes: Number(process.env.ADMIN_RESET_EXPIRES_MINUTES) || 30,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  adminDefaultEmail: process.env.ADMIN_DEFAULT_EMAIL || "admin@shoppingapp.local",
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || "Admin@12345",
  superAdminName: process.env.SUPER_ADMIN_NAME || "Super Admin"
};
