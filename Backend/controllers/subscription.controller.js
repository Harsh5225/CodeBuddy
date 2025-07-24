import { AIUsage } from "../models/aiUsage.js";
import { Subscription } from "../models/subscription.js";
import { User } from "../models/user.js";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// Initialize Solana connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Premium subscription price in SOL
const PREMIUM_PRICE_SOL = 0.0; // 0.1 SOL for premium subscription

export const createSubscription = async (req, res) => {
  try {
    const userId = req.userInfo._id;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required",
      });
    }

    // Check if user already has a subscription
    let subscription = await Subscription.findOne({ userId });

    if (subscription) {
      // Update existing subscription
      subscription.walletAddress = walletAddress;
      await subscription.save();
    } else {
      // Create new free subscription
      subscription = await Subscription.create({
        userId,
        walletAddress,
        subscriptionType: "free",
        features: {
          aiQuestionsPerProblem: 2,
          videoAccess: false,
          unlimitedAI: false,
        },
      });
    }

    res.status(201).json({
      success: true,
      subscription,
      message: "Subscription created successfully",
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
};

export const upgradeToPremium = async (req, res) => {
  try {
    const userId = req.userInfo._id;
    const { transactionSignature, walletAddress } = req.body;

    if (!transactionSignature || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Transaction signature and wallet address are required",
      });
    }

    // Verify transaction on Solana blockchain
    try {
      const transaction = await connection.getTransaction(
        transactionSignature,
        {
          commitment: "confirmed",
        }
      );

      if (!transaction) {
        return res.status(400).json({
          success: false,
          message: "Transaction not found or not confirmed",
        });
      }

      // Verify transaction amount and recipient
      const lamports =
        transaction.meta?.postBalances[1] - transaction.meta?.preBalances[1];
      const solAmount = Math.abs(lamports) / 1000000000; // Convert lamports to SOL

      if (solAmount < PREMIUM_PRICE_SOL) {
        return res.status(400).json({
          success: false,
          message: `Insufficient payment. Required: ${PREMIUM_PRICE_SOL} SOL`,
        });
      }
    } catch (verificationError) {
      console.error("Transaction verification error:", verificationError);
      return res.status(400).json({
        success: false,
        message: "Failed to verify transaction",
      });
    }

    // Update subscription to premium
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        subscriptionType: "premium",
        transactionSignature,
        walletAddress,
        paymentAmount: PREMIUM_PRICE_SOL,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        features: {
          aiQuestionsPerProblem: -1, // Unlimited
          videoAccess: true,
          unlimitedAI: true,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      subscription,
      message: "Successfully upgraded to premium!",
    });
  } catch (error) {
    console.error("Error upgrading to premium:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upgrade subscription",
    });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.userInfo._id;

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    const isActive = subscription.isSubscriptionActive();
    const hasPremium = subscription.hasPremiumAccess();

    res.status(200).json({
      success: true,
      subscription: {
        ...subscription.toObject(),
        isActive,
        hasPremium,
        daysRemaining: Math.ceil(
          (subscription.subscriptionEndDate - new Date()) /
            (1000 * 60 * 60 * 24)
        ),
      },
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get subscription status",
    });
  }
};

export const checkFeatureAccess = async (req, res) => {
  try {
    const userId = req.userInfo._id;
    const { feature, problemId } = req.query;

    const subscription = await Subscription.findOne({ userId });
    console.log("subscription:", subscription);

    if (!subscription) {
      return res.status(200).json({
        success: true,
        hasAccess: false,
        message: "No subscription found. Please connect your Phantom wallet.",
        showAlert: true, // 🔔 Frontend can use this to show alert
      });
    }

    let hasAccess = false;
    let message = "";

    switch (feature) {
      case "video":
        hasAccess =
          subscription.features.videoAccess &&
          subscription.isSubscriptionActive();
        message = hasAccess
          ? "Video access granted"
          : "Premium subscription required for video access";
        break;

      case "ai":
        if (
          subscription.features.unlimitedAI &&
          subscription.isSubscriptionActive()
        ) {
          hasAccess = true;
          message = "Unlimited AI access";
        } else {
          const aiUsage = await AIUsage.findOne({ userId, problemId });
          hasAccess = !aiUsage || aiUsage.canAskQuestion(subscription);
          message = hasAccess
            ? `${
                subscription.features.aiQuestionsPerProblem -
                (aiUsage?.questionsAsked || 0)
              } questions remaining`
            : "Daily AI question limit reached. Upgrade to premium for unlimited access";
        }
        break;

      default:
        message = "Unknown feature";
    }

    res.status(200).json({
      success: true,
      hasAccess,
      message,
      showAlert: false, // 👈 no need to alert in other cases
      subscription: {
        type: subscription.subscriptionType,
        isActive: subscription.isSubscriptionActive(),
        features: subscription.features,
      },
    });
  } catch (error) {
    console.error("Error checking feature access:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check feature access",
    });
  }
};


export const disconnectWallet = async (req, res) => {
  try {
    const userId = req.userInfo._id;

    // Find and update the subscription to remove wallet info
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        $unset: {
          walletAddress: 1,
          transactionSignature: 1
        },
        $set: {
          // Reset to free tier features if premium
          subscriptionType: "free",
          features: {
            aiQuestionsPerProblem: 2,
            videoAccess: false,
            unlimitedAI: false,
          },
          // Clear payment info if exists
          paymentAmount: 0,
          subscriptionEndDate: null
        }
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wallet successfully disconnected",
      subscription
    });

  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disconnect wallet",
    });
  }
};