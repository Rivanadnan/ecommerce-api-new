// src/index.ts
import express from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Kör connectDB så vi ser om databasen är aktiv
connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://e-shop-nu-two.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES – hämtas från dina route-filer (INTE controllers direkt)
import productRouter from "./routes/products";
import customerRouter from "./routes/customers";
import orderRouter from "./routes/orders";
import orderItemRouter from "./routes/orderItems";
import stripeRouter from "./routes/stripe";
import authRouter from "./routes/auth";

app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);
app.use("/stripe", stripeRouter);
app.use("/auth", authRouter);

// Test-rutt
app.get("/", (_, res) => {
  res.send("✅ E-commerce API is running!");
});

// ✅ Exportera för Vercel
export default app;

