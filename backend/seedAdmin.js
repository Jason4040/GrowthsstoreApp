import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "jaygrowth01@gmail.com";
    const password = "Growth@63";
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email });
    if (user) {
      user.password = hashedPassword;
      user.isAdmin = true;
      user.isVerified = true;
      await user.save();
      console.log("Updated existing user to admin.");
    } else {
      user = new User({
        username: "JayGrowth",
        email: email,
        password: hashedPassword,
        isAdmin: true,
        isVerified: true
      });
      await user.save();
      console.log("Created new admin user.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedAdmin();
