import express from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Tillåt frontend både från localhost och från Vercel
app.use(cors({
  origin: [
    "http://localhost:5173", // 👈 lokal utveckling
    "https://e-shop-nu-two.vercel.app", // 👈 din frontend på Vercel
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 🛣️ Routes
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

// 🌐 Test-rutt
app.get("/", (_, res) => {
  res.send("✅ E-commerce API is running!");
});

// 🚀 Start server lokalt
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

// ✅ Export för Vercel
export default app;
