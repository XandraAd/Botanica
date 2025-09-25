import express from "express";
import multer from "multer";
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


// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router
  .route("/")
  .post(createUser)
  .get(protect, admin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);


router.post("/upload-avatar", protect, uploadAvatar);

// Add `upload.single('avatar')` middleware before your controller
router
  .route("/profile")
  .get(protect, getCurrentUserProfile)
  .put(protect, upload.single("avatar"), updateCurrentUserProfile); // ✅ handle avatar upload

// ADMIN ROUTES
router
  .route("/:id")
  .delete(protect, admin, deleteUserById)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById);

export default router;
