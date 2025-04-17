import express from 'express';
import {
  checkoutSessionHosted,
  checkoutSessionEmbedded,
  webhook,
} from '../controllers/stripeController';

const router = express.Router();

// ✅ Hosted Checkout (används i frontend)
router.post('/', checkoutSessionHosted);

// 🟡 Embedded Checkout (valfritt)
router.post('/embedded', checkoutSessionEmbedded);

// 🔵 Webhook (placeholder)
router.post('/webhook', webhook);

export default router;

