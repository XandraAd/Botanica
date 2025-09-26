import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  uploadAvatar,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Cloudinary storage for avatars
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const upload = multer({ storage });

// PUBLIC ROUTES
router.route("/").post(createUser); // Create new user
router.post("/auth", loginUser); // Login
router.post("/logout", logoutCurrentUser); // Logout

// PROTECTED ROUTES
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar); // Upload avatar

router
  .route("/profile")
  .get(protect, getCurrentUserProfile) // Get current user
  .put(protect, upload.single("avatar"), updateCurrentUserProfile); // Update profile & optional avatar

// ADMIN ROUTES
router
  .route("/")
  .get(protect, admin, getAllUsers); // Get all users (admin only)

router
  .route("/:id")
  .delete(protect, admin, deleteUserById)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById);

export default router;
