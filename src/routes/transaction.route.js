import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  getTransactionByUserId,
} from "../controller/transaction.controller.js";

export const router = express.Router();

router.post("/api/transactions", createTransaction);
router.get("/api/transactions/:userId", getTransactionByUserId);
router.delete("/api/transactions/:id", deleteTransaction);
// router.put("/api/transactions/:id", updateTransaction);
router.get("/api/transactions/summary/:userId", getSummary);
