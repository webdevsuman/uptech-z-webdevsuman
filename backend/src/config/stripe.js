import Stripe from "stripe";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  logger.warn("WARNING: STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(stripeSecretKey || "", {
  apiVersion: "2024-04-10",
});

export default stripe;
