import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { userInfo, authReady } = useSelector((state) => state.auth);

  if (!authReady) return null; // wait for auth check

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

