import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  addProductJson,
  getProductsByCategory,
} from "../controllers/productController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import Product from "../models/productModel.js";

const router = express.Router();

// --- Multer Setup ---
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

// ✅ JSON seeding
router.post("/json", protect, admin, addProductJson);

// ✅ Popular
router.get("/popular", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ sold: -1 }).limit(10);

    if (!products.length) {
      return res.status(404).json({ error: "No popular products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular products" });
  }
});

// ✅ Other fixed routes
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/allproducts", fetchAllProducts);

// ✅ Featured (⚡ must be above /:id)
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    console.error("❌ Featured fetch error:", error);
    res.status(500).json({ message: "Server error fetching featured products" });
  }
});

// ✅ Filtering with POST body
router.post("/filtered-products", filterProducts);

// ✅ Filtering with query params (category/collection)
router.get("/", fetchProducts);

// ✅ Category route (⚡ must be above /:id!)
router.get("/category/:slug", getProductsByCategory);

// ✅ CRUD routes
router
  .route("/")
  .post(protect, admin, upload.single("image"), addProduct);

router
  .route("/:id")
  .get(fetchProductById)
  .put(protect, admin, upload.single("image"), updateProductDetails)
  .delete(protect, admin, removeProduct);

router.post("/:id/reviews", protect, checkId, addProductReview);

export default router;
