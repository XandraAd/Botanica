import mongoose from "mongoose";
import dotenv from "dotenv";
import Collection from "../models/collectionModel.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collections = await Collection.find({}).populate({
      path: "products",
      select: "images",
    });

    for (const col of collections) {
      let preview = col.image || col.products?.[0]?.images?.[0] || null;

      if (preview && !preview.startsWith("http")) {
        preview = `http://localhost:5000${preview}`;
      }

      col.previewImage = preview;
      col.count = col.products?.length || 0;
      await col.save();
      console.log(`✅ Updated collection: ${col.name}`);
    }

    console.log("🎉 Collections updated successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error updating collections:", err.message);
    process.exit(1);
  }
};

run();
