import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  createManualOrder,
  uploadPaymentProof,
  approvePaymentProof,
  rejectPaymentProof,
  appealPaymentProof,
  deleteOrder,
  deleteAllOrders,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/manual").post(authenticate, authorizeAdmin, createManualOrder);
router.route("/reset/all").delete(authenticate, authorizeAdmin, deleteAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(authenticate, authorizeAdmin, countTotalOrders);
router.route("/total-sales").get(authenticate, authorizeAdmin, calculateTotalSales);
router.route("/total-sales-by-date").get(authenticate, authorizeAdmin, calcualteTotalSalesByDate);
router
  .route("/:id")
  .get(authenticate, findOrderById)
  .delete(authenticate, authorizeAdmin, deleteOrder);
// Not wired into the checkout flow (no server-side PayPal verification is
// configured), so this is restricted to admin to prevent a logged-in
// customer from self-marking any order paid via a crafted request.
router.route("/:id/pay").put(authenticate, authorizeAdmin, markOrderAsPaid);
router.route("/:id/pay-proof").put(authenticate, uploadPaymentProof);
router.route("/:id/pay-approve").put(authenticate, authorizeAdmin, approvePaymentProof);
router.route("/:id/pay-reject").put(authenticate, authorizeAdmin, rejectPaymentProof);
router.route("/:id/pay-appeal").put(authenticate, appealPaymentProof);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
