import express from "express";
import { createOrder, processPayment, getUserOrders, cancelOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/:id/pay", protect, processPayment);
router.get("/myorders", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
