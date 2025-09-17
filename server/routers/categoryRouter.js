import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/:userId", getCategories);
router.get("/single/:id", getCategoryById);

export default router;
