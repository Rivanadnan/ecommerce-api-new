"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = require("./config/db.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// ✅ Importera routes med .js – viktigt för Vercel
const products_js_1 = __importDefault(require("./routes/products.js"));
const customers_js_1 = __importDefault(require("./routes/customers.js"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
const orderItems_js_1 = __importDefault(require("./routes/orderItems.js"));
const stripe_js_1 = __importDefault(require("./routes/stripe.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const search_js_1 = __importDefault(require("./routes/search.js")); // 👈 fixat här!
dotenv_1.default.config();
// 🔌 Koppla upp till databas
(0, db_js_1.connectDB)();
const app = (0, express_1.default)();
// ✅ CORS – tillåt frontend både lokalt och på Vercel
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://e-shop-nu-two.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ✅ Alla routes
app.use("/products", products_js_1.default);
app.use("/customers", customers_js_1.default);
app.use("/orders", orders_js_1.default);
app.use("/order-items", orderItems_js_1.default);
app.use("/stripe", stripe_js_1.default);
app.use("/auth", auth_js_1.default);
app.use("/search", search_js_1.default);
// 🌐 Test-rutt
app.get("/", (_, res) => {
    res.send("✅ E-commerce API is running!");
});
// 🚀 Kör server lokalt – INTE i production (Vercel hanterar detta)
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
}
// ✅ Export för Vercel
// export default app;
