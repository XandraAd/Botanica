import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/productModel.js";
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
  getSaleProducts,
  getAllReviews,
  getProductReviews,
  fetchPopularProducts // Added this missing controller
} from "../controllers/productController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

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

// ===== PUBLIC ROUTES =====

// ✅ Featured products
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    console.error("❌ Featured fetch error:", error);
    res.status(500).json({ message: "Server error fetching featured products" });
  }
});

// ✅ Popular products
router.get("/popular", fetchPopularProducts);

// ✅ Top rated products
router.get("/top", fetchTopProducts);

// ✅ New products (last 30 days or featured)
router.get("/new", fetchNewProducts);

// ✅ Sale products
router.get("/sale", getSaleProducts);

// ✅ All products (limited to 12)
router.get("/allproducts", fetchAllProducts);

// ✅ Products by category slug
router.get("/category/:slug", getProductsByCategory);

// ✅ All reviews for homepage carousel
router.get("/reviews", getAllReviews);

// ✅ Filter products with POST
router.post("/filtered-products", filterProducts);

// ✅ Get products with pagination/search/filters
router.get("/", fetchProducts);

// ===== PROTECTED ROUTES =====

// ✅ Add review to product (Protected users)
router.post("/:id/reviews", protect, checkId, addProductReview);

// ===== ADMIN ROUTES =====

// ✅ JSON seeding (Admin only)
router.post("/json", protect, admin, addProductJson);

// ✅ Create product (Admin only)
router.post("/", protect, admin, upload.single("image"), addProduct);

// ===== DYNAMIC ID ROUTES (MUST BE LAST) =====

// ✅ Get product by ID
router.get("/:id", fetchProductById);

// ✅ Get reviews for specific product
router.get("/:id/reviews", getProductReviews);

// ✅ Update product (Admin only)
router.put("/:id", protect, admin, upload.single("image"), updateProductDetails);

// ✅ Delete product (Admin only)
router.delete("/:id", protect, admin, removeProduct);

export default router;