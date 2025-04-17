import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// ✅ Ladda miljövariabler
dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://e-shop-nu-two.vercel.app"],
    credentials: true,
  })
);

// ✅ Routes
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

// ✅ Test route
app.get("/", (_, res) => {
  res.send("✅ E-commerce API is running!");
});

// ✅ Starta server lokalt
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

// ✅ Anslut till databas
connectDB();

// ✅ Exportera för Vercel
export default app;
