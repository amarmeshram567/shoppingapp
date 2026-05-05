import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ADMIN_ROLES } from "../constants/roles.js";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 50, default: "Home" },
    fullName: { type: String, trim: true, maxlength: 120, required: true },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    addressLine1: { type: String, trim: true, maxlength: 200, required: true },
    addressLine2: { type: String, trim: true, maxlength: 200, default: "" },
    city: { type: String, trim: true, maxlength: 80, required: true },
    state: { type: String, trim: true, maxlength: 80, default: "" },
    postalCode: { type: String, trim: true, maxlength: 20, required: true },
    country: { type: String, trim: true, maxlength: 80, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const paymentMethodSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 50, default: "Card" },
    brand: { type: String, trim: true, maxlength: 50, required: true },
    last4: { type: String, trim: true, minlength: 4, maxlength: 4, required: true },
    expiryMonth: { type: Number, min: 1, max: 12, required: true },
    expiryYear: { type: Number, min: 2024, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },
    avatar: { type: String, trim: true },
    provider: {
      type: String,
      enum: ["local", "google", "clerk"],
      default: "local"
    },
    googleId: { type: String, unique: true, sparse: true },
    clerkId: { type: String, unique: true, sparse: true },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    addresses: {
      type: [addressSchema],
      default: []
    },
    paymentMethods: {
      type: [paymentMethodSchema],
      default: []
    },
    lastLoginAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    isBlocked: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(ADMIN_ROLES),
      default: ADMIN_ROLES.CUSTOMER
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ createdAt: -1 });

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > new Date());
};

export const User = mongoose.model("User", userSchema);
