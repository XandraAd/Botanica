// backend/controllers/salesController.js
import Product from "../models/productModel.js";

// Fetch all products that have a salePrice
export const getSales = async (req, res) => {
  try {
    const products = await Product.find({
      salePrice: { $exists: true, $ne: null },
    });

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching sales:", error.message);
    res.status(500).json({ message: "Failed to fetch sale products" });
  }
};

