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
import announcementRoutes from "./routes/announcementRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import Product from "./models/productModel.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://growthsstore.com",
  "https://www.growthsstore.com",
  "https://app.growthsstore.com",
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
app.use("/api/announcements", announcementRoutes);
app.use("/api/locations", locationRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const FRONTEND_URL = process.env.FRONTEND_URL || "https://growthsstore.com";

app.get("/sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find({}, "slug updatedAt").lean();

    const staticUrls = [
      { loc: "/", changefreq: "daily", priority: "1.0" },
      { loc: "/shop", changefreq: "daily", priority: "0.9" },
      { loc: "/about", changefreq: "monthly", priority: "0.5" },
      { loc: "/faq", changefreq: "monthly", priority: "0.5" },
    ];

    const urlEntries = [
      ...staticUrls.map(
        (u) =>
          `<url><loc>${FRONTEND_URL}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      ),
      ...products
        .filter((p) => p.slug)
        .map(
          (p) =>
            `<url><loc>${FRONTEND_URL}/product/${p.slug}</loc><lastmod>${new Date(
              p.updatedAt
            ).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
        ),
    ].join("");

    res.set("Content-Type", "application/xml");
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

const startServer = async () => {
  await connectDB();
  if (!process.env.VERCEL) {
    app.listen(port, () => console.log(`Server running on port: ${port}`));
  }
};

startServer();

export default app;
