import express from "express";
import Decor from "../models/decorModel.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all decor items with populated product
router.get("/", async (req, res) => {
  try {
    const decorItems = await Decor.find().populate("product", "_id name price");
    res.json(decorItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new decor item
// POST new decor item
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, image, product } = req.body;
    if (!product) {
      return res.status(400).json({ message: "Product is required for decor" });
    }

    const decor = new Decor({ name, image, product });
    const createdDecor = await decor.save();
    await createdDecor.populate("product", "_id name price");

    res.status(201).json(createdDecor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// DELETE a decor item
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);
    if (!decor) return res.status(404).json({ message: "Decor item not found" });
    await decor.remove();
    res.json({ message: "Decor removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
