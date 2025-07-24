import mongoose from "mongoose";
const { Schema } = mongoose;

const aiUsageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    questionsAsked: {
      type: Number,
      default: 0,
    },
    lastResetDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
aiUsageSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Method to check if user can ask more questions
aiUsageSchema.methods.canAskQuestion = function(subscription) {
  if (subscription && subscription.hasPremiumAccess()) {
    return true; // Premium users have unlimited questions
  }
  
  // Check if we need to reset daily limit
  const today = new Date();
  const lastReset = new Date(this.lastResetDate);
  
  if (today.toDateString() !== lastReset.toDateString()) {
    this.questionsAsked = 0;
    this.lastResetDate = today;
  }
  
  return this.questionsAsked < (subscription?.features?.aiQuestionsPerProblem || 2);
};

// Method to increment question count
aiUsageSchema.methods.incrementQuestionCount = function() {
  this.questionsAsked += 1;
  return this.save();
};

export const AIUsage = mongoose.model("AIUsage", aiUsageSchema);