import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("Enter a valid admin email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email")
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(6, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const productSchema = z.object({
  name: z.string().min(3, "Name is required"),
  brand: z.string().min(2, "Brand is required"),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Select a category"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional(),
  inventory: z.coerce.number().min(0, "Inventory cannot be negative"),
  lowStockThreshold: z.coerce.number().min(0, "Low stock threshold must be valid"),
  status: z.enum(["draft", "active", "archived"]),
  image: z.string().optional(),
  description: z.string().min(20, "Description should be more detailed")
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  parentId: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional()
});

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(1, "Value is required"),
  minOrderValue: z.coerce.number().min(0),
  usageLimit: z.coerce.number().min(1),
  expiresAt: z.string().min(1, "Expiry date is required"),
  description: z.string().optional(),
  maxDiscountAmount: z.coerce.number().optional(),
  active: z.boolean().optional()
});

export const settingsSchema = z.object({
  taxRate: z.coerce.number().min(0).max(1),
  shippingFee: z.coerce.number().min(0),
  paymentGateway: z.string().min(2),
  supportEmail: z.email("Enter a valid support email")
});
