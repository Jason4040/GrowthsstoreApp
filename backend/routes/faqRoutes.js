import express from "express";
const router = express.Router();
import {
  askQuestion,
  answerQuestion,
  getMyQuestions,
  getAdminQuestions,
  getPublicFAQs,
  deleteFAQ,
} from "../controllers/faqController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.post("/ask", authenticate, askQuestion);
router.put("/:id/answer", authenticate, authorizeAdmin, answerQuestion);
router.delete("/:id", authenticate, authorizeAdmin, deleteFAQ);
router.get("/my-questions", authenticate, getMyQuestions);
router.get("/admin/questions", authenticate, authorizeAdmin, getAdminQuestions);
router.get("/public", getPublicFAQs);

export default router;
