import "../config/env.js";
import { connectDB } from "../config/db.js";
import { authService } from "../services/admin/authService.js";
import { Setting } from "../models/Setting.js";

const seedAdmin = async () => {
  await connectDB();

  await authService.seedSuperAdmin();

  const defaults = [
    { key: "tax.defaultRate", value: 0.08, group: "tax", description: "Default tax rate" },
    { key: "shipping.flatCharge", value: 25, group: "shipping", description: "Default shipping charge" },
    { key: "payment.gateway", value: "stripe", group: "payment", description: "Default payment gateway" },
    { key: "email.orderConfirmation", value: "Order confirmation template", group: "email", description: "Order email template" }
  ];

  for (const setting of defaults) {
    await Setting.findOneAndUpdate({ key: setting.key }, setting, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  console.log("Admin seed complete");
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
