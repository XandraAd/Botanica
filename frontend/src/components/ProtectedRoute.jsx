import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!userInfo) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Return the protected component if authenticated
  return children;
};

export default ProtectedRoute;