import mongoose from "mongoose";
import dotenv from "dotenv";
import Collection from "./models/collectionModel.js";
import Product from "./models/productModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

const populateCollections = async () => {
  try {
    const collections = await Collection.find({}).populate({
      path: "products",
      select: "images",
    });

    for (const col of collections) {
      // Use collection.image if exists, otherwise first product image
      let preview = col.image || col.products?.[0]?.images?.[0] || null;

      // Convert relative paths to full URL
      if (preview && !preview.startsWith("http")) {
        preview = `http://localhost:5000${preview}`;
      }

      col.previewImage = preview;
      col.count = col.products?.length || 0; // optional, sync count
      await col.save();
      console.log(`Updated collection: ${col.name}`);
    }

    console.log("✅ All collections updated successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating collections:", err);
    mongoose.disconnect();
  }
};

connectDB().then(populateCollections);
