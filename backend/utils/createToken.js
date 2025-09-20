// utils/createToken.js
import jwt from "jsonwebtoken";

const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // set as cookie (optional if you want cookie auth)
res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // must be false on localhost
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // or "none" if redirect still drops cookie
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});


  return token; // 👈 return so frontend can use it
};

export default createToken;



