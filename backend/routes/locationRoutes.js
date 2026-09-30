import express from "express";
const router = express.Router();
import {
  listLocations,
  createLocation,
  updateLocation,
  removeLocation,
} from "../controllers/locationController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .get(listLocations)
  .post(authenticate, authorizeAdmin, createLocation);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, updateLocation)
  .delete(authenticate, authorizeAdmin, removeLocation);

export default router;
