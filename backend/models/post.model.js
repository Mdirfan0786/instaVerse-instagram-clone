import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
      maxlength: 2200,
    },

    media: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["image", "video", "reel"],
      default: "image",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    shares: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

PostSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model("Post", PostSchema);
