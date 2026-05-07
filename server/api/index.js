import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let dbConnectionPromise;

const ensureDbConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }

  return dbConnectionPromise;
};

export default async function handler(req, res) {
  await ensureDbConnection();
  return app(req, res);
}
