import express from "express";
import isLoggedIn from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

// ================= Create comment route =================
router.post("/:postId/comments", isLoggedIn, addComment);

// ================= Get comments route =================
router.get("/:postId/comments", getPostComments);

// ================= Delete comment route =================
router.delete("/:commentId/comments", isLoggedIn, deleteComment);

export default router;
