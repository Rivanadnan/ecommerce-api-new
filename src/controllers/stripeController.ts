import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { db } from '../config/db';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil',
});

export const checkoutSessionHosted = async (req: Request, res: Response) => {
  const { customer, cart } = req.body;

  if (!customer || !cart || cart.length === 0) {
    return res.status(400).json({ error: 'Kund och varukorg krävs' });
  }

  try {
    const [existingRows] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [customer.email]
    );

    let customerId;
    const existing = existingRows as any[];

    if (existing.length > 0) {
      customerId = existing[0].id;
    } else {
      const [insertResult] = await db.query(
        'INSERT INTO customers (name, email) VALUES (?, ?)',
        [customer.name, customer.email]
      );
      customerId = (insertResult as any).insertId;
    }

    const [orderResult] = await db.query(
      'INSERT INTO orders (customer_id, payment_status, payment_id, order_status) VALUES (?, ?, ?, ?)',
      [customerId, 'Unpaid', '', 'Pending']
    );

    const orderId = (orderResult as any).insertId;

    for (const item of cart) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.id, 1]
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cart.map((item: any) => ({
        price_data: {
          currency: 'sek',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      success_url: `https://e-shop-nu-two.vercel.app/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://e-shop-nu-two.vercel.app/checkout',
      metadata: {
        order_id: orderId.toString(),
      },
    });

    await db.query(
      'UPDATE orders SET payment_id = ?, payment_status = ?, order_status = ? WHERE id = ?',
      [session.id, 'Unpaid', 'Pending', orderId]
    );

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fel vid skapande av checkout-session' });
  }
};

export const checkoutSessionEmbedded = async (_: Request, res: Response) => {
  return res.status(501).json({ message: 'Embedded checkout ej implementerad' });
};

export const webhook = async (_: Request, res: Response) => {
  return res.status(200).json({ message: 'Webhook mottagen (test)' });
};
