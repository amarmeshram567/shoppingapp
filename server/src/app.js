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

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(cors());
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
