import express from "express";
import "dotenv/config";
import { sql } from "../config/db.js";

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

// Route to create a new transaction
app.post("/api/transactions", async (req, res) => {
  try {
    //title, amount, category, user_id
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || !user_id) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Insert transaction into the database
    const transaction = await sql`
    INSERT INTO transactions(user_id, title, amount, category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;

    res.status(201).json({
      message: "Transaction created successfully",
      success: true,
      transaction: transaction[0],
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

// Route to fetch transactions for a specific user
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (isNaN(parseInt(userId))) {
      return res
        .status(400)
        .json({ message: "Invalid User ID", success: false });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }
    const transactions = await sql`
        SELECT * FROM transactions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        `;
    res.status(200).json({
      message: "Transactions fetched successfully",
      success: true,
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

// Route to delete a transaction by ID
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(userId))) {
      return res
        .status(400)
        .json({ message: "Invalid User ID", success: false });
    }
    if (!id) {
      return res
        .status(400)
        .json({ message: "Transaction ID is required", success: false });
    }

    const transactionExists = await sql`
    SELECT * FROM transactions WHERE id = ${id}
    `;

    if (transactionExists.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found", success: false });
    }

    const result = await sql`
        DELETE FROM transactions
        WHERE id = ${id}
        RETURNING *
        `;

    res.status(200).json({
      message: "Transaction deleted successfully",
      success: true,
      transaction: result[0],
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

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
