import { sql } from "../../config/db.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
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
};

// Get all transactions by user
export const getTransactionByUserId = async (req, res) => {
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
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
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
};

// export const updateTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, amount, category } = req.body;

//     if (isNaN(parseInt(userId))) {
//       return res
//         .status(400)
//         .json({ message: "Invalid User ID", success: false });
//     }
//     if (!id) {
//       return res
//         .status(400)
//         .json({ message: "Transaction ID is required", success: false });
//     }

//     const transactionExists = await sql`
//     SELECT * FROM transactions WHERE id = ${id}
//     `;

//     if (transactionExists.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Transaction not found", success: false });
//     }

//     const result = await sql`
//         UPDATE transactions
//         SET title = ${title}, amount = ${amount}, category = ${category}
//         WHERE id = ${id}
//         RETURNING *
//         `;

//     res.status(200).json({
//       message: "Transaction updated successfully",
//       success: true,
//       transaction: result[0],
//     });
//   } catch (error) {
//     console.error("Error updating transaction:", error);
//     res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };

export const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }

    const balanceSum = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`;

    const incomeSum = await sql`
    SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expenseSum = await sql`
    SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      message: "Summary fetched successfully",
      success: true,
      balance: balanceSum[0].balance,
      income: incomeSum[0].income,
      expense: expenseSum[0].expense,
    });
  } catch (error) {
    console.error(`Error getting summary`, error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
