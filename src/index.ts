import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// 🛠️ FIX: Tillåt frontend från både lokal och Vercel
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://e-shop-nu-two.vercel.app"
  ],
  credentials: true,
}));

// 🧭 Routes
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

app.get("/", (_, res) => {
  res.send("✅ E-commerce API is running!");
});

// 🌍 Lokalt eller på Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

export default app;
