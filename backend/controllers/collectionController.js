import asyncHandler from "../middlewares/asyncHandler.js";
import Collection from "../models/collectionModel.js";

// @desc    Get all collections (with product count)
// @route   GET /api/collections
// @access  Public
export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({});

  // Add product count dynamically
  const collectionsWithCounts = collections.map((col) => ({
    ...col.toObject(),
    productsCount: col.products ? col.products.length : 0,
  }));

  res.json(collectionsWithCounts);
});




// @desc    Get single collection by ID
// @route   GET /api/collections/:id
// @access  Public
export const getCollectionById = asyncHandler(async (req, res) => {
  try {
    console.log("🔎 Fetching collection with ID:", req.params.id);

    const collection = await Collection.findById(req.params.id).populate("products");

    if (!collection) {
      console.log("⚠️ Collection not found for ID:", req.params.id);
      res.status(404);
      throw new Error("Collection not found");
    }

    res.json(collection);
  } catch (error) {
    console.error("❌ Error in getCollectionById:", error.message);
    res.status(500).json({ message: error.message });
  }
});



// @desc    Create new collection
// @route   POST /api/collections
// @access  Admin
export const createCollection = asyncHandler(async (req, res) => {
  const { name, description, image, products } = req.body;

  const collection = new Collection({
    name,
    description,
    image,
    products: products || [],
    count: products?.length || 0,
  });

  const createdCollection = await collection.save();
  res.status(201).json(createdCollection);
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Admin
export const updateCollection = asyncHandler(async (req, res) => {
  const { name, description, image, products } = req.body;

  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.name = name || collection.name;
    collection.description = description || collection.description;
    collection.image = image || collection.image;
    if (products) {
      collection.products = products;
      collection.count = products.length;
    }

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Admin
export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    await collection.deleteOne();
    res.json({ message: "Collection removed" });
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});



// Add product to collection   
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

  // ✅ keep count updated
  collection.count = collection.products.length;

  await collection.save();
  res.json(collection);
});

