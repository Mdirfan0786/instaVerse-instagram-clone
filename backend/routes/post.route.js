import express from "express";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import {
  createPost,
  deletePost,
  getFeed,
  sharePost,
  toggleLike,
} from "../controllers/post.controller.js";

const router = express.Router();

// ================= Create Post route =================
router.post("/", isLoggedIn, upload.single("media"), createPost);

// ================= Get Post Feed route =================
router.get("/feed", isLoggedIn, getFeed);

// ================= Toggle Like route =================
router.post("/:postId/like", isLoggedIn, toggleLike);

// ================= Share Post route =================
router.post("/:postId/share", isLoggedIn, sharePost);

// ================= Delete Post route =================
router.delete("/:postId", isLoggedIn, deletePost);

export default router;
