import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

//* =============== Add comment Post =============== *//
export const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text) {
    throw new AppError(400, "Comment text required!");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, "Post not found!");
  }

  const comment = await Comment.create({
    text,
    owner: req.user._id,
    post: postId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });

  res.status(201).json({
    success: true,
    message: "Comment Created Successfull!",
    comment,
  });
});

//* =============== Get Post comment =============== *//
export const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { cursor } = req.query;

  if (!postId) {
    throw new AppError(400, "Post id is required");
  }

  const limit = 10;

  let query = { post: postId };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const comments = await Comment.find(query)
    .populate("owner", "username profilePic")
    .sort({ createdAt: -1 })
    .limit(limit);

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].createdAt : null;

  const hasMore = comments.length === limit;

  res.status(200).json({
    success: true,
    comments,
    nextCursor,
    hasMore,
  });
});

//* =============== Delete comment =============== *//
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new AppError(400, "comment Id required!");
  }

  const comment = await Comment.findById(commentId).populate("post");

  if (!comment) {
    throw new AppError(404, "comment not found!");
  }

  const isCommentOwner = comment.owner.toString() === req.user._id.toString();
  const isPostOwner = comment.post.owner.toString() === req.user._id.toString();

  if (!isCommentOwner && !isPostOwner) {
    throw new AppError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();

  //   count updation
  await Post.findByIdAndUpdate(comment.post._id, {
    $inc: { commentsCount: -1 },
  });

  res.status(200).json({
    success: true,
    message: "Comment Deleted Successfull!",
  });
});
