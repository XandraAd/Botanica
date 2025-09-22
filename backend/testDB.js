// backend/testDB.js
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const testDB = async () => {
  try {
    console.log("🔑 Using MONGO_URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Database error:", error);
    process.exit(1);
  }
};

testDB();
