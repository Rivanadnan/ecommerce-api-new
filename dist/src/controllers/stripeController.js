"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = exports.checkoutSessionEmbedded = exports.checkoutSessionHosted = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
const checkoutSessionHosted = async (req, res) => {
    const { customer, cart } = req.body;
    if (!customer || !cart || cart.length === 0) {
        return res.status(400).json({ error: 'Kund och varukorg krävs' });
    }
    try {
        const [existing] = await db_1.db.query('SELECT * FROM customers WHERE email = ?', [customer.email]);
        let customerId;
        if (existing.length > 0) {
            customerId = existing[0].id;
        }
        else {
            const [result] = await db_1.db.query('INSERT INTO customers (name, email) VALUES (?, ?)', [`${customer.firstname} ${customer.lastname}`, customer.email]);
            customerId = result.insertId;
        }
        const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        const [orderResult] = await db_1.db.query('INSERT INTO orders (customer_id, total_price, payment_status, payment_id, order_status) VALUES (?, ?, ?, ?, ?)', [customerId, totalPrice, 'Unpaid', '', 'Pending']);
        const orderId = orderResult.insertId;
        for (const item of cart) {
            await db_1.db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [orderId, item.id, item.quantity || 1]);
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: cart.map((item) => ({
                price_data: {
                    currency: 'sek',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity || 1,
            })),
            success_url: `https://e-shop-h3tbmjtmr-warmness-travels-projects.vercel.app/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://e-shop-h3tbmjtmr-warmness-travels-projects.vercel.app/checkout`,
            metadata: {
                order_id: orderId.toString(),
            },
        });
        await db_1.db.query('UPDATE orders SET payment_id = ?, payment_status = ?, order_status = ? WHERE id = ?', [session.id, 'Unpaid', 'Pending', orderId]);
        res.json({ url: session.url });
    }
    catch (err) {
        console.error('❌ Fel i checkoutSessionHosted:', err);
        res.status(500).json({ error: 'Fel vid skapande av checkout-session' });
    }
};
exports.checkoutSessionHosted = checkoutSessionHosted;
const checkoutSessionEmbedded = async (_req, res) => {
    return res.status(501).json({ message: 'Embedded checkout ej implementerad' });
};
exports.checkoutSessionEmbedded = checkoutSessionEmbedded;
const webhook = async (_req, res) => {
    return res.status(200).json({ message: 'Webhook mottagen (test)' });
};
exports.webhook = webhook;
