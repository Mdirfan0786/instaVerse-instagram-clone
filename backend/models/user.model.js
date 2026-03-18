import mongoose from "mongoose";

// Basic user info
const basicInfoSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    select: false,
  },
  googleId: {
    type: String,
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
};

// Profile info
const profileSchema = {
  profilePic: {
    type: String,
    default: "",
  },
  profilePicId: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
};

// Social info
const socialSchema = {
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  followers_count: {
    type: Number,
    default: 0,
  },

  following_count: {
    type: Number,
    default: 0,
  },

  postCount: {
    type: Number,
    default: 0,
  },

  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
};

const userSchema = new mongoose.Schema(
  {
    ...basicInfoSchema,
    ...profileSchema,
    ...socialSchema,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
