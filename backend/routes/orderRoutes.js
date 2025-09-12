import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route("/mine").get(protect, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(protect, findOrderById);
router.route("/:id/pay").put(protect, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(protect, admin, markOrderAsDelivered);

export default router;