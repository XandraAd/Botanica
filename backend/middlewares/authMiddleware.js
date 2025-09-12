// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (common for APIs)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(req.headers.authorization);

      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  // Also check for token in cookies (for web apps)
  else if (req.cookies?.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Check for admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); 
  } else {    
    res.status(403); // Use 403 Forbidden instead of 401 Unauthorized
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };