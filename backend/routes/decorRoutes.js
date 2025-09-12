import express from "express";
import Decor from "../models/decorModel.js";

const router = express.Router();

// @desc   Get all decor
// @route  GET /api/decor
// @access Public
router.get("/", async (req, res) => {
  try {
    const decor = await Decor.find({});
    res.json(decor);
  } catch (error) {
    console.error("Fetch decor error:", error.message);
    res.status(500).json({ message: "Server error fetching decor" });
  }
});

// @desc   Create decor
// @route  POST /api/decor

router.post("/", async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image required" });
    }

    const decor = new Decor({ name, image });
    const createdDecor = await decor.save();
    res.status(201).json(createdDecor);
  } catch (error) {
    console.error("Create decor error:", error.message);
    res.status(500).json({ message: "Server error creating decor" });
  }
});

// @desc   Delete decor
// @route  DELETE /api/decor/:id
router.delete("/:id", async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);
    if (!decor) {
      return res.status(404).json({ message: "Decor not found" });
    }
    await decor.deleteOne();
    res.json({ message: "Decor deleted" });
  } catch (error) {
    console.error("Delete decor error:", error.message);
    res.status(500).json({ message: "Server error deleting decor" });
  }
});

export default router;
