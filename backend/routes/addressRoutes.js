import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route("/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;
