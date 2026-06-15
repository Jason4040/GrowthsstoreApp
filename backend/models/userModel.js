import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
 
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
 
    otp: {
      type: String,
    },
 
    otpExpires: {
      type: Date,
    },

    googleId: {
      type: String,
    },

    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
