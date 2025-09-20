import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";
import Collection from "./models/collectionModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const populateCollections = async () => {
  const products = await Product.find({}).lean();

  for (const product of products) {
    if (product.collections?.length) {
      await Collection.updateMany(
        { _id: { $in: product.collections } },
        { $addToSet: { products: product._id } }
      );
    }
  }

  console.log("Collections populated successfully!");
  mongoose.disconnect();
};

connectDB().then(populateCollections);
