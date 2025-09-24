// routes/saleRoutes.js
import express from "express";
const router = express.Router();
import { getSales } from "../controllers/salesController.js";

router.get("/", getSales);

export default router;
