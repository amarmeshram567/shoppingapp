import mongoose from "mongoose";

export const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const requireFields = (payload, fields) => {
  const missingFields = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};

export const clampNumber = (value, min, max, fallback) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

export const toBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};
