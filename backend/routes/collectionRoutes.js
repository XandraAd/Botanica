import express from "express";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCollections)
  .post(protect, admin, createCollection);

router
  .route("/:id")
  .get(getCollectionById)
  .put(protect, admin, updateCollection)
  .delete(protect, admin, deleteCollection);

export default router;
