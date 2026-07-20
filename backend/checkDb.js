import mongoose from "mongoose";
import connectDB from "./config/db.js";
import FAQQuestion from "./models/faqModel.js";
import dotenv from "dotenv";

dotenv.config();

const check = async () => {
    try {
        await connectDB();
        const faqs = await FAQQuestion.find({});
        console.log("First FAQ from DB:");
        console.dir(faqs[0].toObject(), { depth: null });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
