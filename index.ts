import express from "express";
import { connectDB } from "./src/config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import productRouter from "./src/routes/products";
import customerRouter from "./src/routes/customers";
import orderRouter from "./src/routes/orders";
import orderItemRouter from "./src/routes/orderItems";
import stripeRouter from "./src/routes/stripe";
import authRouter from "./src/routes/auth";
import searchRouter from "./src/routes/search";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://e-shop-eight-lilac.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);
app.use("/stripe", stripeRouter);
app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.get("/", (_, res) => {
  res.send("✅ E-commerce API is running!");
});


export default app;
