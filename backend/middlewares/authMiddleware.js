// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  try {
    // ✅ Check for token in cookies first (web app sessions)
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    // 🔄 Fallback: check for Bearer token in headers (Postman / mobile clients)
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
console.log("Request headers:", req.headers);

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded userId:", decoded.userId);
const user = await User.findById(decoded.userId);
console.log("Found user in DB:", user);

    // ✅ Attach user to request
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// ✅ Admin check
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
