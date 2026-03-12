import Post from "../models/post.model.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { Pagination } from "../utils/pegination.js";
import mongoose from "mongoose";

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

  await User.findByIdAndUpdate(userId, {
    $inc: { postCount: 1 },
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

//* =============== Get Single Post of a User =============== *//
export const getUserPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new AppError(400, "Post required!");
  }

  const post = await Post.findById(postId)
    .populate("owner", "username profilePic")
    .populate("likes", "username profilePic");

  if (!post) {
    throw new AppError(404, "Post not found!");
  }

  res.status(200).json({
    success: true,
    message: "User Single Post Fetched!",
    post,
    likesCount: post.likes.length,
  });
});

//* =============== Get All Posts of a User =============== *//
export const getAllPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const { page, limit, skip } = Pagination(req.query.page, req.query.limit);

  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const query = {
    owner: user._id,
  };

  const [posts, totalPosts] = await Promise.all([
    Post.find(query)
      .populate("owner", "username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Post.countDocuments(query),
  ]);

  const hasMore = skip + posts.length < totalPosts;

  res.status(200).json({
    success: true,
    message: "All Posts of a User fetched successfully",
    page,
    totalPosts,
    count: posts.length,
    hasMore,
    posts,
  });
});

//* =============== Explore Posts =============== *//
export const explorePosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { page, limit, skip } = Pagination(req.query.page, req.query.limit);

  const query = {
    owner: { $ne: new mongoose.Types.ObjectId(userId) },
  };

  const [posts, totalPosts] = await Promise.all([
    Post.find(query)
      .populate("owner", "username profilePic")
      .sort({
        likesCount: -1,
        shares: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Post.countDocuments(query),
  ]);

  const hasMore = skip + posts.length < totalPosts;

  res.status(200).json({
    success: true,
    message: "Explore posts fetched successfully",
    page,
    totalPosts,
    count: posts.length,
    hasMore,
    posts,
  });
});

//* =============== Get Feed Post =============== *//
export const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { page, limit, skip } = Pagination(req.query.page, req.query.limit);

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const query = {
    owner: { $in: [...user.following, userId] },
  };

  const [posts, totalPosts] = await Promise.all([
    Post.find(query)
      .populate("owner", "username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Post.countDocuments(query),
  ]);

  const hasMore = skip + posts.length < totalPosts;

  res.status(200).json({
    success: true,
    message: "Feed fetched successfully",
    page,
    totalPosts,
    count: posts.length,
    hasMore,
    posts,
  });
});

//* =============== Delete Post =============== *//
export const deletePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  if (!postId) {
    throw new AppError(400, "Post id required!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found!");
  }

  // Check owner
  const isPostOwner = post.owner.toString() === userId.toString();

  if (!isPostOwner) {
    throw new AppError(403, "You are not authorized to delete this post");
  }

  await post.deleteOne();
  await User.findByIdAndUpdate(userId, {
    $inc: { postCount: -1 },
  });

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

//* =============== Toggle Like =============== *//
export const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

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

//* =============== Share Post =============== *//
export const sharePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  if (!postId) {
    throw new AppError(400, "postId required!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found");
  }

  // add User uniquely
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { sharedBy: userId } },
    { returnDocument: "after" },
  );

  // Share count updation
  updatedPost.shares = updatedPost.sharedBy.length;

  await updatedPost.save();

  res.status(200).json({
    success: true,
    message: "Post shared successfully",
    shares: updatedPost.shares,
  });
});

//* =============== Save Post =============== *//
export const savedPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  if (!postId) {
    throw new AppError(400, "postId required!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found!");
  }

  const savePost = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedPosts: postId } },
    { returnDocument: "after" },
  );

  res.status(200).json({
    success: true,
    message: "Post Saved Successfull!",
    savedPost: savePost,
  });
});

//* =============== Unsave Post =============== *//
export const unsavePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  if (!postId) {
    throw new AppError(400, "postId required!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found!");
  }

  const unsavePost = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedPosts: postId } },
    { returnDocument: "after" },
  );

  res.status(200).json({
    success: true,
    message: "Post unsave successfull!",
    unsavePost: unsavePost,
  });
});

//* =============== Get Save Post =============== *//
export const getSavedPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .select("savedPosts")
    .populate({
      path: "savedPosts",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "owner",
        select: "username profilePic",
      },
    });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  res.status(200).json({
    success: true,
    message: "Saved posts fetched successfully!",
    postCount: user.savedPosts.length,
    posts: user.savedPosts,
  });
});
