import express from "express";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import {
  getUserByUsername,
  searchUser,
  updateUser,
} from "../controllers/user.controller.js";
import { getMe } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/search", isLoggedIn, searchUser);
router.get("/me", isLoggedIn, getMe);
router.get("/:username", getUserByUsername);
router.put("/edit", isLoggedIn, upload.single("profilePic"), updateUser);

export default router;
