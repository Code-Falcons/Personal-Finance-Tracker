import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  googleLogin,
} from "../controllers/authController.js";
import protectedRoutes from "../middlewares/authMiddleware.js";

import passport from "passport";

import("../middlewares/authGoogle.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

// google Auth
router.get(
  "/toAuth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleLogin
);

// for testing
// router.get("/callback", (req, res, next) => {
//   req.user = { email: "bahaa@gmail.com", name: "Test User" };
//   googleLogin(req, res, next);
// });

router.get("/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

router.get("/profile", protectedRoutes, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});
export default router;
