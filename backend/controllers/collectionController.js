import asyncHandler from "../middlewares/asyncHandler.js";
import Collection from "../models/collectionModel.js";

import slugify from "slugify";





export const createCollection = asyncHandler(async (req, res) => {
  console.log('Slugify function:', typeof slugify); // Check if it's defined
  console.log('Request body:', req.body);
  
  const { name, description, image, products } = req.body;

  try {
    const slug = slugify(name, { lower: true });
    console.log('Generated slug:', slug);
    
    const collection = new Collection({
      name,
      slug,
      description,
      image,
      products: products || [],
      count: products?.length || 0,
    });

    const createdCollection = await collection.save();
    res.status(201).json(createdCollection);
  } catch (error) {
    console.error('Error in createCollection:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all collections with product preview and count
// @route   GET /api/collections
// @access  Public
export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({})
    .populate({
      path: "products",
      select: "name images",
    })
    .lean();

  const transformed = collections.map((col) => ({
    _id: col._id,
    name: col.name,
    slug: col.slug || slugify(col.name, { lower: true }),
    previewImage: col.products?.[0]?.images?.[0] || null,
    count: col.products?.length || 0,
  }));

  res.json(transformed);
});

// @desc    Get single collection by ID
// @route   GET /api/collections/:id
// @access  Public
export const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id).populate("products");

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  res.json(collection);
});

// @desc    Get single collection by slug
// @route   GET /api/collections/slug/:slug
// @access  Public
export const getCollectionBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const collection = await Collection.findOne({ slug }).populate("products");

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  res.json(collection);
});




// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Admin
export const updateCollection = asyncHandler(async (req, res) => {
  const { name, description, image, products } = req.body;

  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  if (name) {
    collection.name = name;
    collection.slug = slugify(name, { lower: true }); // update slug
  }
  collection.description = description || collection.description;
  collection.image = image || collection.image;
  if (products) {
    collection.products = products;
    collection.count = products.length;
  }

  const updatedCollection = await collection.save();
  res.json(updatedCollection);
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Admin
export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  await collection.deleteOne();
  res.json({ message: "Collection removed" });
});

// @desc    Add product to collection
// @route   POST /api/collections/add-product
// @access  Admin
export const addProductToCollection = asyncHandler(async (req, res) => {
  const { collectionId, productId } = req.body;

  const collection = await Collection.findById(collectionId);
  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  // avoid duplicates
  if (!collection.products.includes(productId)) {
    collection.products.push(productId);
  }

  collection.count = collection.products.length;

  await collection.save();
  res.json(collection);
});
