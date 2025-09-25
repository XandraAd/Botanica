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
  getSaleProducts,
  getAllReviews
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

// ✅ Category route (⚡ must be above /:id!)
router.get("/category/:slug", getProductsByCategory);

// ✅ All reviews (for homepage carousel)
router.get("/reviews", async (req, res) => {
  try {
    const products = await Product.find().select("name images reviews");

    const allReviews = products.flatMap((product) =>
      product.reviews.map((review) => ({
        ...review.toObject(),
        productName: product.name,
        productImage: product.images?.[0] || null,
      }))
    );

    res.json({ reviews: allReviews });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
});

// ✅ CRUD routes
router
  .route("/")
  .get(fetchProducts)
  .post(protect, admin, upload.single("image"), addProduct);

router.get("/sale", getSaleProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(protect, admin, upload.single("image"), updateProductDetails)
  .delete(protect, admin, removeProduct);

router.post("/:id/reviews", protect, checkId, addProductReview);


// Reviews list endpoint
router.get("/reviews", getAllReviews);


export default router;
