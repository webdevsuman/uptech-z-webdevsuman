import { Router } from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const wishlistRouter = Router();

// Wishlist operations require authentication
wishlistRouter.use(authMiddleware);

wishlistRouter.post("/toggle", wishlistController.toggleWishlist);
wishlistRouter.get("/status/:courseId", wishlistController.checkWishlistStatus);
wishlistRouter.get("/my", wishlistController.getMyWishlist);

export default wishlistRouter;
