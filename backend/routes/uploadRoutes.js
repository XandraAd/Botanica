import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();


const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// ✅ Define BEFORE router.post
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: err.message });
    }

    console.log("Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    res.json({
      message: "Image uploaded successfully",
      image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
  });
});


export default router;

