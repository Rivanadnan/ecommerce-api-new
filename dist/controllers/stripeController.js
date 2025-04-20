"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = exports.checkoutSessionEmbedded = exports.checkoutSessionHosted = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
dotenv_1.default.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2025-03-31.basil',
// });
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
const checkoutSessionHosted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer, cart } = req.body;
    if (!customer || !cart || cart.length === 0) {
        return res.status(400).json({ error: 'Kund och varukorg krävs' });
    }
    try {
        const [existing] = yield db_1.db.query('SELECT * FROM customers WHERE email = ?', [customer.email]);
        let customerId;
        if (existing.length > 0) {
            customerId = existing[0].id;
        }
        else {
            const [result] = yield db_1.db.query('INSERT INTO customers (name, email) VALUES (?, ?)', [customer.name, customer.email]);
            customerId = result.insertId;
        }
        const [orderResult] = yield db_1.db.query('INSERT INTO orders (customer_id, payment_status, payment_id, order_status) VALUES (?, ?, ?, ?)', [customerId, 'Unpaid', '', 'Pending']);
        const orderId = orderResult.insertId;
        for (const item of cart) {
            yield db_1.db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [orderId, item.id, item.quantity || 1]);
        }
        const session = yield stripe.checkout.sessions.create({
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
            success_url: `https://e-shop-nu-two.vercel.app/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://e-shop-nu-two.vercel.app/checkout`,
            metadata: {
                order_id: orderId.toString(),
            },
        });
        yield db_1.db.query('UPDATE orders SET payment_id = ?, payment_status = ?, order_status = ? WHERE id = ?', [session.id, 'Unpaid', 'Pending', orderId]);
        res.json({ url: session.url });
    }
    catch (err) {
        console.error('❌ Fel i checkoutSessionHosted:', err);
        res.status(500).json({ error: 'Fel vid skapande av checkout-session' });
    }
});
exports.checkoutSessionHosted = checkoutSessionHosted;
const checkoutSessionEmbedded = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(501).json({ message: 'Embedded checkout ej implementerad' });
});
exports.checkoutSessionEmbedded = checkoutSessionEmbedded;
const webhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ message: 'Webhook mottagen (test)' });
});
exports.webhook = webhook;
