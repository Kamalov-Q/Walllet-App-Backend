// routes/transactions.js
import express from "express";
import {
  createTransaction,
  getTransactionByUserId,
  deleteTransaction,
  getSummary,
} from "../controller/transaction.controller.js";

export const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - title
 *         - amount
 *         - category
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         title:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *           example:
 *             user_id: 1
 *             title: "Grocery Shopping"
 *             amount: -50.75
 *             category: "Food"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
router.post("/transactions", createTransaction);

/**
 * @swagger
 * /api/transactions/{userId}:
 *   get:
 *     summary: Get transactions by user ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       400:
 *         description: Invalid User ID
 *       500:
 *         description: Internal Server Error
 */
router.get("/transactions/:userId", getTransactionByUserId);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       400:
 *         description: Invalid or missing Transaction ID
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/transactions/:id", deleteTransaction);

/**
 * @swagger
 * /api/transactions/summary/{userId}:
 *   get:
 *     summary: Get financial summary for a user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Internal Server Error
 */
router.get("/transactions/summary/:userId", getSummary);
