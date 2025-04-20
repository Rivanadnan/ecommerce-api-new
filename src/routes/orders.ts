// src/routes/orders.ts
import express from "express";
import {
  getOrders,
  getOrderById,
  getOrderBySessionId,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderBySessionId,
} from "../controllers/orderController";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.get("/payment/:session_id", getOrderBySessionId);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.patch("/payment/:session_id", updateOrderBySessionId);
router.delete("/:id", deleteOrder);

export default router;
