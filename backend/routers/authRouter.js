import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";
import protectedRoutes from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/profile", protectedRoutes, (req, res) => {
  res.json({ message: "Welcome to your profile", userId: req.user });
});
export default router;
