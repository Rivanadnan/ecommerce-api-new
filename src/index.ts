import express from "express";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Importera routes med .js – viktigt för Vercel
import productRouter from "./routes/products.js";
import customerRouter from "./routes/customers.js";
import orderRouter from "./routes/orders.js";
import orderItemRouter from "./routes/orderItems.js";
import stripeRouter from "./routes/stripe.js";
import authRouter from "./routes/auth.js";
import searchRouter from "./routes/search.js"; // 👈 fixat här!

dotenv.config();

// 🔌 Koppla upp till databas
connectDB();

const app = express();

// ✅ CORS – tillåt frontend både lokalt och på Vercel
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://e-shop-nu-two.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Alla routes
app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);
app.use("/stripe", stripeRouter);
app.use("/auth", authRouter);
app.use("/search", searchRouter);

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
export default app;
