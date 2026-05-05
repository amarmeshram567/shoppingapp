import { AuditLog } from "../models/AuditLog.js";
import { logger } from "../config/logger.js";

export const audit = (action, entityType) => async (req, res, next) => {
  res.on("finish", async () => {
    try {
      if (res.statusCode >= 400) return;

      await AuditLog.create({
        actor: req.user?._id,
        actorRole: req.user?.role,
        action,
        entityType,
        entityId: req.params.id || req.params.orderId || req.params.productId || null,
        metadata: {
          method: req.method,
          route: req.originalUrl,
          requestId: req.requestId
        }
      });
    } catch (error) {
      logger.error(`Audit log failed: ${error.message}`);
    }
  });

  next();
};
