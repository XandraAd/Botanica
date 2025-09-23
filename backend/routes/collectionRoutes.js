import express from "express";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
 getCollectionBySlug,
  addProductToCollection,
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

  // routes/collectionRoutes.js
router.get("/slug/:slug", getCollectionBySlug);

router.post("/add-product", protect, admin, addProductToCollection);


export default router;
