import express from "express";
import "dotenv/config";
import { sql } from "../config/db.js";
import { router } from "./routes/transaction.route.js";

const app = express();

const PORT = process?.env?.PORT || 5001;

async function initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Middleware to parse JSON requests
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
