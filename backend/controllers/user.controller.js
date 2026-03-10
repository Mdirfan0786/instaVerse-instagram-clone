import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

//* =============== Get User By Username =============== *//
export const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("-password");

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  res.status(200).json({
    success: true,
    user,
    followers: user.followers_count,
    following: user.following_count,
  });
});

//* =============== Update User Profile =============== *//
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, bio, username } = req.body;

  if (!name && !bio && !username && !req.file) {
    throw new AppError(400, "Provide at least one field to update");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  //* Profile Image Upload
  if (req.file) {
    // delete old image from cloudinary
    if (user.profilePicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicId);
      } catch (error) {
        console.log("Failed to delete old image:", error.message);
      }
    }

    // upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "instaverse_profiles",
    });

    user.profilePic = result.secure_url;
    user.profilePicId = result.public_id;

    // delete local file
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.log("Failed to delete local file:", error.message);
    }
  }

  // Username Update
  if (username && username !== user.username) {
    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new AppError(400, "Username already exists!");
    }

    user.username = username;
  }

  // Other Fields
  if (name) user.name = name;
  if (bio) user.bio = bio;

  await user.save();

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    success: true,
    user: userData,
  });
});

//* =============== User Search filter =============== *//
export const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new AppError(400, "Search Query is required!");
  }

  const search = query.trim();

  const users = await User.find({
    _id: { $ne: req.user.id }, //remove own profile from search
    $or: [
      { username: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ],
  })
    .select("name username profilePic")
    .limit(10);

  res.status(200).json({
    success: true,
    users: users,
  });
});

//* =============== Follow User =============== *//
export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.user;
  const { username: targetUsername } = req.params;

  if (username === targetUsername) {
    throw new AppError(400, "You can't follow yourself");
  }

  const user = await User.findOne({ username });
  const targetUser = await User.findOne({ username: targetUsername });

  if (!user || !targetUser) {
    throw new AppError(404, "User not found");
  }

  // already following check
  if (
    user.following.some((id) => id.toString() === targetUser._id.toString())
  ) {
    throw new AppError(400, "Already following this user");
  }

  await User.findByIdAndUpdate(user._id, {
    $addToSet: { following: targetUser._id }, //$addToSet - for removing duplicate follow
    $inc: { following_count: 1 },
  });

  await User.findByIdAndUpdate(targetUser._id, {
    $addToSet: { followers: user._id },
    $inc: { followers_count: 1 },
  });

  res.status(200).json({
    success: true,
    message: "User followed successfully",
  });
});

//* =============== unfollow User =============== *//
export const unfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.user;
  const { username: targetUsername } = req.params;

  const user = await User.findOne({ username });
  const targetUser = await User.findOne({ username: targetUsername });

  if (!user || !targetUser) {
    throw new AppError(404, "User not found");
  }

  // Check if the current user is actually following the target user
  if (
    !user.following.some((id) => id.toString() === targetUser._id.toString())
  ) {
    throw new AppError(400, "You are not following this user");
  }

  await User.findByIdAndUpdate(user._id, {
    $pull: { following: targetUser._id },
    $inc: { following_count: -1 },
  });

  await User.findByIdAndUpdate(targetUser._id, {
    $pull: { followers: user._id },
    $inc: { followers_count: -1 },
  });

  res.status(200).json({
    success: true,
    message: "User unfollowed successfully",
  });
});

//* =============== Getting Followers List =============== *//
export const getFollowers = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).populate(
    "followers",
    "username name profilePic",
  );

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  res.status(200).json({
    success: true,
    count: user.followers_count,
    followers: user.followers,
  });
});

//* =============== Getting Followings List =============== *//
export const getFollowings = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).populate(
    "following",
    "username name profilePic",
  );

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  res.status(200).json({
    success: true,
    count: user.following_count,
    followings: user.following,
  });
});
