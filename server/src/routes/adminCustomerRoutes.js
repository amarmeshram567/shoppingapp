import express from "express";
import {
  blockAdminCustomer,
  getAdminCustomerHistory,
  listAdminCustomers,
  unblockAdminCustomer
} from "../controllers/adminCustomerController.js";
import { audit } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", listAdminCustomers);
router.get("/:id/orders", getAdminCustomerHistory);
router.patch("/:id/block", audit("block_customer", "customer"), blockAdminCustomer);
router.patch("/:id/unblock", audit("unblock_customer", "customer"), unblockAdminCustomer);

export default router;
