// src/routes/stripe.ts
import { Router } from 'express';
import {
  checkoutSessionHosted,
  checkoutSessionEmbedded,
  webhook,
} from '../controllers/stripeController';

const router = Router();

// ✅ Hosted Checkout (används i frontend)
router.post('/checkout-session-hosted', async (req, res) => {
  try {
    await checkoutSessionHosted(req, res);
  } catch (error) {
    console.error('Fel i hosted checkout:', error);
    res.status(500).json({ error: 'Serverfel vid hosted checkout' });
  }
});

// 🟡 Embedded Checkout (valfritt)
router.post('/checkout-session-embedded', async (req, res) => {
  try {
    await checkoutSessionEmbedded(req, res);
  } catch (error) {
    console.error('Fel i embedded checkout:', error);
    res.status(500).json({ error: 'Serverfel vid embedded checkout' });
  }
});

// 🔵 Webhook (placeholder)
router.post('/webhook', async (req, res) => {
  try {
    await webhook(req, res);
  } catch (error) {
    console.error('Fel i webhook:', error);
    res.status(500).json({ error: 'Serverfel vid webhook' });
  }
});

export default router;
