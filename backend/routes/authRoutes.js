import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  googleAuth,
  googleCallback,
  getMe,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);

export default router;
