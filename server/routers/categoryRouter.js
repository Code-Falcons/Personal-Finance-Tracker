import express from "express";
import { getCat } from "../controllers/categoryController";

const router = express.Router();
router.get("/category", getCat);
export default router;
