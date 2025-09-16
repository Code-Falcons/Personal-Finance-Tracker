import express from "express";
import {
    getSummary,
    getCategorySpending,
    addTransaction,
    deleteTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary", getSummary);

router.get("/category-spending", getCategorySpending);

router.post("/", addTransaction);

router.delete("/:id", deleteTransaction);

export default router;
