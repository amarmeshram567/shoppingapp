import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { clerkMiddleware } from "@clerk/express";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { swaggerSpec } from "./config/swagger.js";
import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
import { requestContext } from "./middleware/requestContext.js";
import { logger } from "./config/logger.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(requestContext);

const allowedOrigins = [
  env.clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://shoppingapp-shopp-eight.vercel.app"
].filter(Boolean);


app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser and same-origin requests that do not send an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
applySecurityMiddleware(app);
app.use(clerkMiddleware());
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.get("/", (req, res) => {
  res.send("API is live")
})
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
