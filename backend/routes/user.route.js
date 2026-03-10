import express from "express";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

import {
  followUser,
  getFollowers,
  getFollowings,
  getUserByUsername,
  searchUser,
  unfollowUser,
  updateUser,
} from "../controllers/user.controller.js";

import { getMe } from "../controllers/auth.controller.js";

const router = express.Router();

// ================= USER SEARCH =================
router.get("/search", isLoggedIn, searchUser);

// ================= CURRENT USER =================
router.get("/me", isLoggedIn, getMe);

// ================= PROFILE UPDATE =================
router.put("/edit", isLoggedIn, upload.single("profilePic"), updateUser);

// ================= FOLLOW SYSTEM =================
router.post("/:username/follow", isLoggedIn, followUser);
router.post("/:username/unfollow", isLoggedIn, unfollowUser);

// ================= FOLLOW LIST =================
router.get("/:username/followers", getFollowers);
router.get("/:username/following", getFollowings);

// ================= USER PROFILE =================
router.get("/:username", getUserByUsername);

export default router;
