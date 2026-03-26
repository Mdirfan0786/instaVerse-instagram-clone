import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Explore from "../pages/Explore/Explore.jsx";
import Home from "../pages/Home/Home.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import SavedPost from "../pages/SavedPosts/SavedPosts.jsx";
import AuthCallback from "../pages/AuthCallback/AuthCallback.jsx";
import Settings from "../pages/Settings/Settings.jsx";
import Create from "../pages/Create/Create.jsx";
import Notification from "../pages/Notification/Notification.jsx";

import ProtectedRoutes from "./protectedRoutes";
import AppLayout from "../components/Layout/AppLayout/AppLayout.jsx";

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      {/* Root route */}
      <Route
        path="/"
        element={token ? <Navigate to="/home" /> : <Navigate to={"/login"} />}
      />

      {/* Public route */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/saved" element={<SavedPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
