import express from "express";
import {
    getSavings,
    addSaving,
    deleteSaving,
    updateSaving,
    getActiveSavingsByUser,
    pauseSaving,
    resumeSaving
} from "../controllers/savingController.js";

const router = express.Router();

router.get("/", getSavings);

router.post("/", addSaving);

router.delete("/:id", deleteSaving);

router.patch("/:id", updateSaving);

router.get("/active", getActiveSavingsByUser);

router.patch("/:id/pause", pauseSaving);

router.patch("/:id/resume", resumeSaving);

export default router;