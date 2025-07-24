import express from "express";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import {
  createSubscription,
  upgradeToPremium,
  getSubscriptionStatus,
  checkFeatureAccess,
  disconnectWallet,
} from "../controllers/subscription.controller.js";

const router = express.Router();

// Create or update subscription
router.post("/create", userMiddleware, createSubscription);

// Upgrade to premium
router.post("/upgrade", userMiddleware, upgradeToPremium);

// Get subscription status
router.get("/status", userMiddleware, getSubscriptionStatus);

// Check feature access
router.get("/check-access", userMiddleware, checkFeatureAccess);
router.post("/disconnect", userMiddleware, disconnectWallet);

export default router;