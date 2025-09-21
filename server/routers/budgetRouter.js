import express from "express";
import {
    getBudgets,
    addBudget,
    deleteBudget,
    getInProgressBudgetsByUserAndCategory,
    updateBudget
} from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", getBudgets);

router.post("/", addBudget);

router.delete("/:id", deleteBudget);

router.get("/in-progress", getInProgressBudgetsByUserAndCategory);

router.patch("/:id", updateBudget);

export default router;