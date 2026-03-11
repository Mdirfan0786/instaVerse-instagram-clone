import Post from "../models/post.model.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

//* =============== Create Post =============== *//
export const createPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { caption, type } = req.body;

  if (!req.file) {
    throw new AppError(400, "Media file is required!");
  }

  //   upload to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "instaverse/posts",
    resource_type: "auto",
  });

  //   delete file from local
  try {
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.log("File delete error:", err);
  }

  const post = await Post.create({
    caption,
    media: result.secure_url,
    type,
    owner: userId,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

//* =============== Get Feed Post =============== *//
export const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const posts = await Post.find({
    owner: { $in: [...user.following, userId] },
  })
    .populate("owner", "username profilePic")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments({
    owner: { $in: [...user.following, userId] },
  });

  res.status(200).json({
    success: true,
    message: "Feed fetched successfully",
    page,
    totalPosts,
    count: posts.length,
    posts,
  });
});

//* =============== Toggle Like =============== *//
export const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found!");
  }

  // checking already liked
  const alreadyLike = post.likes.some((id) => id.toString() === userId);

  let updatedPost;

  if (alreadyLike) {
    // then Unlike
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Post Unliked",
      likesCount: updatedPost.likes.length,
    });
  } else {
    // Like
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Post Liked",
      likesCount: updatedPost.likes.length,
    });
  }
});
