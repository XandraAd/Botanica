// controllers/productController.js

import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Collection from "../models/collectionModel.js";
import Category from "../models/categoryModel.js"

// Create Product with image
export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    collection,
    sizes,
    colors,
    images,
    inStock,
    featured
  } = req.body;

  if (!images || images.length === 0) {
    res.status(400);
    throw new Error("Product must have at least one image");
  }

  const product = new Product({
    name,
    description,
    price,
    category,
    collection,
    sizes,
    colors,
    images,       
    inStock,      
    featured: featured === "true" || featured === true,
  });

  const createdProduct = await product.save();
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

    const { name, description, price, category, collections, image, featured } = req.body;

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
    product.collections = collections?.length ? collections : product.collections;
    product.featured = typeof featured === "boolean" ? featured : product.featured;

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

  if (product.collection) {
    const collection = await Collection.findById(product.collection);
    if (collection) {
      collection.products.pull(product._id);
      collection.count = collection.products.length; // ✅ update
      await collection.save();
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
    .populate("collection")
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


// ✅ Reviews
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  product.reviews.push({
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

// ✅ Top Products
export const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

// ✅ New Products
export const fetchNewProducts = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newProducts = await Product.find({
    createdAt: { $gte: thirtyDaysAgo },
  })
    .sort({ createdAt: -1 })
    .limit(10);

  if (newProducts.length === 0) {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(10);
    return res.json(featuredProducts);
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



// ✅ Filter atgoris
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

    res.json({ products });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
