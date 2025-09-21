import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);

  // Prevent rendering until auth is verified
  if (loading) return null; // or a spinner <div>Loading...</div>

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

