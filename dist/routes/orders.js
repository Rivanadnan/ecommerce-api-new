"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orders.ts
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.get("/", orderController_1.getOrders);
router.get("/:id", orderController_1.getOrderById);
router.get("/payment/:session_id", orderController_1.getOrderBySessionId);
router.post("/", orderController_1.createOrder);
router.patch("/:id", orderController_1.updateOrder);
router.patch("/payment/:session_id", orderController_1.updateOrderBySessionId);
router.delete("/:id", orderController_1.deleteOrder);
exports.default = router;
