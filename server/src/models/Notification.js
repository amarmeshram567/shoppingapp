import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../constants/notification.js";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    isRead: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
