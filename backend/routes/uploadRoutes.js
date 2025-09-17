import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Configure multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "botanica_uploads", // 👈 keeps Botanica images separate
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }], // auto optimize
  },
});

const upload = multer({ storage });

// Upload route
router.post("/", upload.single("image"), (req, res) => {
  try {
    res.json({
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename, // unique ID in Cloudinary
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;
