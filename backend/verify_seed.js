import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const checkData = async () => {
    try {
        await connectDB();
        const userCount = await User.countDocuments();
        const categoryCount = await Category.countDocuments();
        const productCount = await Product.countDocuments();

        console.log(`Users: ${userCount}`);
        console.log(`Categories: ${categoryCount}`);
        console.log(`Products: ${productCount}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
