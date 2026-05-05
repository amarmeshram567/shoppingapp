import "../config/env.js";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { productSeed } from "../data/products.js";

const seedDatabase = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Coupon.deleteMany({});
  await Product.insertMany(productSeed);
  await Coupon.insertMany([
    {
      code: "LIOR10",
      description: "10% off on your order",
      discountType: "percentage",
      discountValue: 10,
      minimumOrderAmount: 0,
      active: true
    }
  ]);
  console.log(`Seeded ${productSeed.length} products`);
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
