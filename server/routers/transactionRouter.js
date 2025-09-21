import express from "express";
import {
    getSummary,
    getCategorySpending,
    addTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary", getSummary);

router.get("/category-spending", getCategorySpending);

router.post("/", addTransaction);

router.delete("/:id", deleteTransaction);

router.get("/", getTransactions);

router.patch("/:id", updateTransaction); // we just want to update the amount and notes !

export default router;
