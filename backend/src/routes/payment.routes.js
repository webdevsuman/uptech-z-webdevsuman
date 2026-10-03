import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import paymentController from "../controllers/payment.controller.js";

const paymentRouter = Router();

// Create Checkout Session (Authenticated students)
paymentRouter.post(
  "/create-checkout-session",
  authMiddleware,
  paymentController.createCheckoutSession
);

// Verify Checkout Session upon redirect (Authenticated students)
paymentRouter.post(
  "/verify-session",
  authMiddleware,
  paymentController.verifySession
);

// Webhook endpoint (unauthenticated, signed by Stripe)
paymentRouter.post("/webhook", paymentController.handleWebhook);

export default paymentRouter;
