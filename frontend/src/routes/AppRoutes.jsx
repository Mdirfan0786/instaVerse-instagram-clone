import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Explore from "../pages/Explore/Explore.jsx";
import Home from "../pages/Home/Home.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import SavedPost from "../pages/SavedPosts/SavedPosts.jsx";

import ProtectedRoutes from "./protectedRoutes";

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      {/* Root route */}
      <Route
        path="/"
        element={token ? <Navigate to="/home" /> : <Navigate to="/login" />}
      />

      {/* Public route */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/saved" element={<SavedPost />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
