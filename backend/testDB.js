// Create a simple test script: backend/testDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    // Check if products collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasProductsCollection = collections.some(col => col.name === 'products');
    console.log("Products collection exists:", hasProductsCollection);
    
    // Check product count
    const productCount = await mongoose.connection.db.collection('products').countDocuments();
    console.log("Number of products in database:", productCount);
    
    // Show a sample product if exists
    if (productCount > 0) {
      const sampleProduct = await mongoose.connection.db.collection('products').findOne();
      console.log("Sample product:", sampleProduct);
    }
    
    process.exit();
  } catch (error) {
    console.error("❌ Database error:", error);
    process.exit(1);
  }
};

testDB();