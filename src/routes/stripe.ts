import express from 'express';
import {
  checkoutSessionHosted,
  checkoutSessionEmbedded,
  webhook,
} from '../controllers/stripeController';

const router = express.Router();

// ✅ Hosted Checkout (används i frontend)
router.post('/checkout-session-hosted', (req, res) => {
  checkoutSessionHosted(req, res).catch((err) => {
    console.error('❌ Stripe Hosted Checkout Error:', err);
    res.status(500).json({ error: 'Stripe Hosted Checkout error' });
  });
});

// 🟡 Embedded Checkout (valfritt)
router.post('/embedded', (req, res) => {
  checkoutSessionEmbedded(req, res).catch((err) => {
    console.error('❌ Embedded Checkout Error:', err);
    res.status(500).json({ error: 'Embedded Checkout error' });
  });
});

// 🔵 Webhook (placeholder)
router.post('/webhook', (req, res) => {
  webhook(req, res).catch((err) => {
    console.error('❌ Webhook Error:', err);
    res.status(500).json({ error: 'Webhook error' });
  });
});

export default router;
