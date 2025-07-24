import { Subscription } from "../models/subscription.js";
import { AIUsage } from "../models/aiUsage.js";

// Middleware to check if user has access to premium features
export const checkPremiumAccess = async (req, res, next) => {
  try {
    const userId = req.userInfo._id;
    
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription || !subscription.hasPremiumAccess()) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required",
        upgradeRequired: true,
      });
    }
    
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error("Error checking premium access:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify subscription",
    });
  }
};

// Middleware to check video access
export const checkVideoAccess = async (req, res, next) => {
  try {
    const userId = req.userInfo._id;
    
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription || !subscription.features.videoAccess || !subscription.isSubscriptionActive()) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required for video access",
        upgradeRequired: true,
      });
    }
    
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error("Error checking video access:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify video access",
    });
  }
};

// Middleware to check and track AI usage
export const checkAIAccess = async (req, res, next) => {
  try {
    const userId = req.userInfo._id;
    const { problemId } = req.body;
    
    const subscription = await Subscription.findOne({ userId });
    console.log("hello")
    // If user has premium, allow unlimited access
    if (subscription && subscription.hasPremiumAccess() && subscription.features.unlimitedAI) {
      req.subscription = subscription;
      req.aiUsage = null; // No tracking needed for premium users
      return next();
    }
    
    // For free users, check usage limits
    let aiUsage = await AIUsage.findOne({ userId, problemId });
    
    if (!aiUsage) {
      aiUsage = await AIUsage.create({ userId, problemId, questionsAsked: 0 });
    }
    
    if (!aiUsage.canAskQuestion(subscription)) {
      return res.status(429).json({
        success: false,
        message: "Daily AI question limit reached. Upgrade to premium for unlimited access",
        upgradeRequired: true,
        questionsRemaining: 0,
      });
    }
    
    req.subscription = subscription;
    req.aiUsage = aiUsage;
    next();
  } catch (error) {
    console.error("Error checking AI access:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify AI access",
    });
  }
};

// Middleware to increment AI usage after successful request
export const incrementAIUsage = async (req, res, next) => {
  try {
    if (req.aiUsage) {
      await req.aiUsage.incrementQuestionCount();
    }
    next();
  } catch (error) {
    console.error("Error incrementing AI usage:", error);
    // Don't block the response, just log the error
    next();
  }
};