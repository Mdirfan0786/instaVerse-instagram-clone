import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
