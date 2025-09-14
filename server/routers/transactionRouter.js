import express from "express";
import { getSummary, getCategorySpending, addTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary", getSummary);

router.get("/category-spending", getCategorySpending);

router.post("/", addTransaction);

export default router;
