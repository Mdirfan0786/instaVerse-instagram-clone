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
    $or: [
      { username: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ],
  })
    .select("name username profilePic")
    .limit(10);

  // remove current user
  const filteredUsers = users.filter(
    (user) => user._id.toString() !== req.user.id,
  );

  res.status(200).json({
    success: true,
    users: filteredUsers,
  });
});
