import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    password: z.string().min(8)
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    brand: z.string().min(2),
    category: z.string().min(2),
    price: z.coerce.number().nonnegative(),
    description: z.string().min(10)
  }).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2)
  }).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const couponSchema = z.object({
  body: z.object({
    code: z.string().min(3),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.coerce.number().nonnegative()
  }).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});
