import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";

dotenv.config();

const backfillSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const products = await Product.find({ $or: [{ slug: { $exists: false } }, { slug: null }] });
    for (const product of products) {
      await product.save();
      console.log(`Product "${product.name}" -> ${product.slug}`);
    }
    console.log(`Backfilled ${products.length} product slug(s).`);

    const categories = await Category.find({ $or: [{ slug: { $exists: false } }, { slug: null }] });
    for (const category of categories) {
      await category.save();
      console.log(`Category "${category.name}" -> ${category.slug}`);
    }
    console.log(`Backfilled ${categories.length} category slug(s).`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

backfillSlugs();
