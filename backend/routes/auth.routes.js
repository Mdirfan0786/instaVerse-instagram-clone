import express from "express";
import passport from "passport";
import {
  getMe,
  googleCallback,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ================= CURRENT USER =================
router.get("/me", isLoggedIn, getMe);

// Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

export default router;
