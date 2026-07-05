import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../controllers/announcementController.js";

router.route("/")
  .get(getAnnouncements)
  .post(authenticate, authorizeAdmin, createAnnouncement);

router.route("/:id")
  .put(authenticate, authorizeAdmin, updateAnnouncement)
  .delete(authenticate, authorizeAdmin, deleteAnnouncement);

export default router;
