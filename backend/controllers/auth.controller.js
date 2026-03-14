import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

//* =============== Register new User =============== *//
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, mobile, password } = req.body;

  // validation
  if (!name || !username || !email || !password) {
    throw new AppError(400, "All fields are required!");
  }

  // checking existing user
  const query = [{ email }, { username }];

  if (mobile) {
    query.push({ mobile });
  }

  const existingUser = await User.findOne({ $or: query });

  if (existingUser) {
    throw new AppError(400, "User already exists!");
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creating user
  const user = await User.create({
    name,
    username,
    email,
    mobile,
    password: hashedPassword,
  });

  const userData = user.toObject();
  delete userData.password;

  res.status(201).json({
    message: "User registered successfully",
    user: userData,
  });
});

//* =============== Login User =============== *//
export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new AppError(400, "Identifier and password are required!");
  }

  // finding user with email / username / mobile
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
      { mobile: identifier },
    ],
  }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(401, "Invalid credentials!");
  }

  // generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    message: "Login Successfully!",
    token,
    user: userData,
  });
});

//* =============== Google Login =============== *//
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Google authentication failed",
    });
  }
};

//* =============== Get Me =============== *//
export const getMe = asyncHandler(async (req, res) => {
  console.log("Get me Fetched:");
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    user,
  });
});
