// src/routes/stripe.ts
import express from 'express';
import {
  checkoutSessionHosted,
  checkoutSessionEmbedded,
  webhook,
} from '../controllers/stripeController';

const router = express.Router();

// ✅ Hosted Checkout (används i frontend)
router.post('/checkout-session-hosted', (req, res) => {
  checkoutSessionHosted(req, res);
});

// 🟡 Embedded Checkout (valfritt)
router.post('/embedded', (req, res) => {
  checkoutSessionEmbedded(req, res);
});

// 🔵 Webhook (valfritt)
router.post('/webhook', (req, res) => {
  webhook(req, res);
});

export default router;
