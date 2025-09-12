import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// updateCategory
export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  category.name = name || category.name;
  const updatedCategory = await category.save();

  res.json(updatedCategory);
});

// removeCategory
export const removeCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully" });
});


export const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

