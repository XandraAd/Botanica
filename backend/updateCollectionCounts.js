import mongoose from "mongoose";
import dotenv from "dotenv";
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

const updateCollectionCounts = async () => {
  const collections = await Collection.find({});
  for (const col of collections) {
    col.count = col.products.length;
    await col.save();
  }
  console.log("Collection counts updated!");
  mongoose.disconnect();
};

connectDB().then(updateCollectionCounts);
