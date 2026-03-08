import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Server running!");
});

app.use("/api/auth", authRoutes);

// PORT
const PORT = process.env.PORT || 7870;

// Database
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "instaVerse" });
    console.log("MongoDB Connected!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("failed to start server!", err.message);
    process.exit(1);
  }
};

start();
