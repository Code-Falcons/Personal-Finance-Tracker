import express from "express";
import { getSummary, getCategorySpending } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary", getSummary);

router.get("/category-spending", getCategorySpending);

export default router;
