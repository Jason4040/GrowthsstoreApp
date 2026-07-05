import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { getAnnouncement, updateAnnouncement } from "../controllers/announcementController.js";

router.route("/").get(getAnnouncement).put(authenticate, authorizeAdmin, updateAnnouncement);

export default router;
