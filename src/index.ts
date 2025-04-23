import express from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import productRouter from "./routes/products";
import customerRouter from "./routes/customers";
import orderRouter from "./routes/orders";
import orderItemRouter from "./routes/orderItems";
import stripeRouter from "./routes/stripe";
import authRouter from "./routes/auth";
import searchRouter from "./routes/search";

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


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}


export default app;
