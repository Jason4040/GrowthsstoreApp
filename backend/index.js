// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://growthsstore.com",
  "https://www.growthsstore.com",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.PROD_FRONTEND_URL) {
  allowedOrigins.push(process.env.PROD_FRONTEND_URL);
}
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const uniqueOrigins = [...new Set(allowedOrigins.filter(Boolean))];

app.use(
  cors({
    origin: uniqueOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/faq", faqRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Server running on port: ${port}`));
}

export default app;
