import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, admin, createCategory);
router.route("/:categoryId").put(protect, admin, updateCategory);
router
  .route("/:categoryId")
  .delete(protect, admin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;