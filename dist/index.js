"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./src/config/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = __importDefault(require("./src/routes/products"));
const customers_1 = __importDefault(require("./src/routes/customers"));
const orders_1 = __importDefault(require("./src/routes/orders"));
const orderItems_1 = __importDefault(require("./src/routes/orderItems"));
const stripe_1 = __importDefault(require("./src/routes/stripe"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const search_1 = __importDefault(require("./src/routes/search"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://e-shop-h3tbmjtmr-warmness-travels-projects.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/products", products_1.default);
app.use("/customers", customers_1.default);
app.use("/orders", orders_1.default);
app.use("/order-items", orderItems_1.default);
app.use("/stripe", stripe_1.default);
app.use("/auth", auth_1.default);
app.use("/search", search_1.default);
app.get("/", (_, res) => {
    res.send("✅ E-commerce API is running!");
});
exports.default = app;
