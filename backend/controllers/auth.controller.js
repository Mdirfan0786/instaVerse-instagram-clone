import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//* =============== Register new User =============== *//
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, mobile, password } = req.body;

    // validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    // checking existing user
    const query = [{ email }, { username }];

    if (mobile) {
      query.push({ mobile });
    }

    const existingUser = await User.findOne({ $or: query });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user
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
  } catch (err) {
    console.error("Error While Register User:", err.message);

    res.status(500).json({
      message: "Server Error!",
    });
  }
};

//* =============== Login User =============== *//
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required!",
      });
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
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials!",
      });
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
  } catch (err) {
    console.error("Error While Login User:", err.message);

    res.status(500).json({
      message: "Server Error!",
    });
  }
};
