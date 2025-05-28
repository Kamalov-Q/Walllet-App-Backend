import express from "express";
import "dotenv/config";
import { router } from "./routes/transaction.route.js";
import { initDB } from "./config/db.config.js";
import rateLimiter from "./middleware/rate-limiter.js";

const app = express();

const PORT = process?.env?.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(express.json());

app.use(router);

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
