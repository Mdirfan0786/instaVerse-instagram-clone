import express from "express";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import {
  createPost,
  deletePost,
  getFeed,
  getUserPost,
  getAllPosts,
  savedPost,
  sharePost,
  toggleLike,
  unsavePost,
  explorePosts,
  getSavedPost,
} from "../controllers/post.controller.js";

const router = express.Router();

// ================= Create Post =================
router.post("/", isLoggedIn, upload.single("media"), createPost);

// ================= Feed =================
router.get("/feed", isLoggedIn, getFeed);

// ================= Explore =================
router.get("/explore", isLoggedIn, explorePosts);

// ================= Explore =================
router.get("/saved", isLoggedIn, getSavedPost);

// ================= User All Posts (Profile) =================
router.get("/user/:username", isLoggedIn, getAllPosts);

// ================= Toggle Like =================
router.post("/:postId/like", isLoggedIn, toggleLike);

// ================= Share =================
router.post("/:postId/share", isLoggedIn, sharePost);

// ================= Save / Unsave =================
router.post("/:postId/save", isLoggedIn, savedPost);
router.delete("/:postId/save", isLoggedIn, unsavePost);

// ================= Delete Post =================
router.delete("/:postId", isLoggedIn, deletePost);

// ================= Get Single Post =================
router.get("/:postId", isLoggedIn, getUserPost);

export default router;
