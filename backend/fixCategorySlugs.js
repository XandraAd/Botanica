import mongoose from "mongoose";
import slugify from "slugify";
import dotenv from "dotenv";
import Category from "./models/categoryModel.js"

dotenv.config(); // loads your .env or .env.production

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function generateSlugs() {
  const categories = await Category.find({});
  for (const cat of categories) {
    if (!cat.slug) {
      cat.slug = slugify(cat.name, { lower: true });
      await cat.save();
      console.log(`Slug added for ${cat.name}: ${cat.slug}`);
    }
  }
  console.log("🎉 Done!");
  mongoose.disconnect();
}

generateSlugs();
