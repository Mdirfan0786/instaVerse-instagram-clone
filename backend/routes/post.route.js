import express from "express";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import {
  createPost,
  getFeed,
  toggleLike,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", isLoggedIn, upload.single("media"), createPost);
router.get("/feed", isLoggedIn, getFeed);
router.post("/:id/like", isLoggedIn, toggleLike);

export default router;
