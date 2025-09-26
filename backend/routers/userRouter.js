import express from "express";
import { printUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", printUser);

export default router;
