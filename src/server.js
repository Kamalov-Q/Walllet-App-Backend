import express from "express";
import "dotenv/config";
import { initDB } from "./config/db.config.js";
import rateLimiter from "./middleware/rate-limiter.js";
import { specs, swaggerUi } from "../swagger/swagger.js";
import { router } from "./routes/transaction.route.js";
import job from "./config/cron.config.js";
import cors from "cors";

const app = express();

const PORT = process?.env?.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(cors({ origin: "*" }));
app.use(express.json());

if (process.env.NODE_ENV === "production") job.start();

app.use("/api", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
