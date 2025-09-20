// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import decorRoutes from "./routes/decorRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js"
import addressRoutes from "./routes/addressRoutes.js"




dotenv.config();
const port = process.env.PORT || 5000;
const app = express();


// Middleware

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL
  credentials: true, // allow cookies
}));

connectDB();

app.use(express.static(path.join(path.resolve(), "public")));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/collections",collectionRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/addresses",addressRoutes)
app.use("/api/decor", decorRoutes);
app.use("/api/payment",paymentRoutes)



// Resolve dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folders
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); // <-- correct since uploads is outside backend



const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Start Server

  app.listen(PORT, () => {
    console.log(`
      🚀 Server running in ${process.env.NODE_ENV || "development"} mode
      🔗 URL: http://localhost:${PORT}
      📅 ${new Date().toLocaleString()}
     
    `);
  });
