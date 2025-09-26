// controllers/productController.js

import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Collection from "../models/collectionModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";

// Create Product with images and update collections
export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    collections, // ✅ array of collection IDs
    sizes,
    colors,
    images,
    inStock,
    featured,
  } = req.body;

  if (!images || images.length === 0) {
    res.status(400);
    throw new Error("Product must have at least one image");
  }

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Name, price, and category are required");
  }

  // Create the product
  const product = new Product({
    name: name.trim(),
    description: description?.trim() || "",
    price: Number(price),
    category,
    collections: collections || [],
    sizes: sizes || [],
    colors: colors || [],
    images,
    inStock: Boolean(inStock),
    featured: featured === "true" || featured === true,
  });

  const createdProduct = await product.save();

  // Update collections in bulk
  if (collections?.length) {
    await Collection.updateMany(
      { _id: { $in: collections } },
      {
        $addToSet: { products: createdProduct._id }, // avoid duplicates
      }
    );

    // Optionally, update the count for all collections
    await Collection.updateMany({ _id: { $in: collections } }, [
      { $set: { count: { $size: "$products" } } }, // MongoDB aggregation pipeline to recalc count
    ]);
  }

  res.status(201).json(createdProduct);
});

export const addProductJson = asyncHandler(async (req, res) => {
  try {
    const products = req.body; // assuming array of products
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    const created = await Product.insertMany(products);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add products JSON" });
  }
});

// ✅ Update Product

export const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    console.log("🛠 Incoming update body:", req.body);

    const { name, description, price, category, collections, image, featured } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    if (image) product.images = [image];
    product.category = category || product.category;
    product.collections = collections?.length
      ? collections
      : product.collections;
    product.featured =
      typeof featured === "boolean" ? featured : product.featured;

    const updatedProduct = await product.save();

    console.log("✅ Product updated:", updatedProduct);

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete Product
export const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.collections?.length) {
    for (const colId of product.collections) {
      const collection = await Collection.findById(colId);
      if (collection) {
        collection.products.pull(product._id);
        collection.count = collection.products.length;
        await collection.save();
      }
    }
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

// ✅ Get products with pagination, search, category, and collection filter
export const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 6;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const collectionFilter = req.query.collection
    ? { collection: req.query.collection }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};

  // merge filters
  const filter = { ...keyword, ...collectionFilter, ...categoryFilter };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category")
    .populate("collections")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    count,
    page,
    pages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  });
});

// ✅ Get single product
export const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// ✅ Get all products
export const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .limit(12)
    .sort({ createdAt: -1 });

  res.json({ products }); // 👈 wrap inside an object
});


// ✅ Add product review
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate reviews
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // Verified buyer check
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      isPaid: true,
      "orderItems.product": req.params.id,
    });

    if (!hasOrdered) {
      return res.status(403).json({ message: "Only verified buyers can review" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Add new review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // Update stats
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added",
      review,
      reviews: product.reviews,
      numReviews: product.numReviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Top Products
export const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

// ✅ New Products
export const fetchNewProducts = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let newProducts = await Product.find({
    createdAt: { $gte: thirtyDaysAgo },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("category", "name") // populate category name
    .populate("collections", "name"); // populate collection names

  // If no new products, fallback to featured
  if (newProducts.length === 0) {
    newProducts = await Product.find({ featured: true })
      .limit(10)
      .populate("category", "name")
      .populate("collections", "name");
  }

  res.json(newProducts);
});

// ✅ Popular Products
export const fetchPopularProducts = asyncHandler(async (req, res) => {
  const popularProducts = await Product.find({
    brandImage: { $exists: true, $ne: "" },
  })
    .limit(10)
    .sort({ createdAt: -1 });

  res.json(popularProducts);
});

// ✅ Filter Products
export const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;

  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args);
  res.json(products);
});

// ✅ Filter categorised products
export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    // find category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // fetch products in this category
    const products = await Product.find({ category: category._id });
    const subcategories = [
      ...new Set(products.map((p) => p.subcategory).filter(Boolean)),
    ];
    res.json({ products, subcategories });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Sale products
export const getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ sale: true });

    if (!products.length) {
      return res.status(404).json({ message: "No sale products found" });
    }

    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching sale products:", error);
    res.status(500).json({ message: "Server error fetching sale products" });
  }
};


// ==================================================
// Get All Reviews (with product + user info)
// ==================================================
export const getAllReviews = asyncHandler(async (req, res) => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

  const products = await Product.find({ "reviews.0": { $exists: true } })
    .select("name images reviews")
    .populate("reviews.user", "name avatar");

  const allReviews = products.flatMap((product) =>
    product.reviews.map((review) => {
      let productImage = product.images?.[0] || null;
      if (productImage && !productImage.startsWith("http")) {
        productImage = `${BASE_URL}/${productImage.replace(/^\/+/, "")}`;
      }

      let userAvatar = review.user?.avatar || null;
      if (userAvatar && !userAvatar.startsWith("http")) {
        userAvatar = `${BASE_URL}/${userAvatar.replace(/^\/+/, "")}`;
      }

      return {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        userName: review.user?.name || "Happy Plant Lover",
        userAvatar,
        productName: product.name,
        productImage,
      };
    })
  );

  allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const limit = Number(req.query.limit) || 10;
  res.json(allReviews.slice(0, limit));
});

// ==================================================
// Get Reviews for a Single Product
// ==================================================
export const getProductReviews = asyncHandler(async (req, res) => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name avatar"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const reviews = product.reviews.map((review) => {
    let userAvatar = review.user?.avatar || null;
    if (userAvatar && !userAvatar.startsWith("http")) {
      userAvatar = `${BASE_URL}/${userAvatar.replace(/^\/+/, "")}`;
    }

    return {
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      userName: review.user?.name || "Happy Plant Lover",
      userAvatar,
    };
  });

  res.json(reviews);
});

