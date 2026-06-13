import express from "express";
const router = express.Router();
import {
  sendMessage,
  getMessages,
  getChatUsers,
} from "../controllers/messageController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, sendMessage)
  .get(authenticate, getMessages);

router.route("/chats/users").get(authenticate, authorizeAdmin, getChatUsers);

router.route("/:userId").get(authenticate, authorizeAdmin, getMessages);

export default router;
