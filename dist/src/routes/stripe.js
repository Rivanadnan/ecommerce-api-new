"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripeController_js_1 = require("../controllers/stripeController.js");
const router = express_1.default.Router();
// ✅ Stripe Hosted Checkout – används i frontend
router.post("/checkout-session-hosted", (req, res) => {
    (0, stripeController_js_1.checkoutSessionHosted)(req, res).catch((err) => {
        console.error("❌ Stripe Hosted Checkout Error:", err);
        res.status(500).json({ error: "Stripe Hosted Checkout error" });
    });
});
// 🟡 Embedded Checkout (valfritt – används ej i frontend)
router.post("/embedded", (req, res) => {
    (0, stripeController_js_1.checkoutSessionEmbedded)(req, res).catch((err) => {
        console.error("❌ Embedded Checkout Error:", err);
        res.status(500).json({ error: "Embedded Checkout error" });
    });
});
// 🔵 Webhook (valfritt – placeholder)
router.post("/webhook", (req, res) => {
    (0, stripeController_js_1.webhook)(req, res).catch((err) => {
        console.error("❌ Webhook Error:", err);
        res.status(500).json({ error: "Webhook error" });
    });
});
exports.default = router;
