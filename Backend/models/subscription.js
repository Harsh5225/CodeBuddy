import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptionType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    transactionSignature: {
      type: String,
      required: function () {
        return this.subscriptionType === "premium";
      },
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionEndDate: {
      type: Date,
      default: function () {
        // Free users get 30 days, premium gets 365 days
        const days = this.subscriptionType === "premium" ? 365 : 30;
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentAmount: {
      type: Number, // Amount in SOL
      default: 0,
    },
    features: {
      aiQuestionsPerProblem: {
        type: Number,
        default: 2, // Free users get 2 questions per problem
      },
      videoAccess: {
        type: Boolean,
        default: false, // Only premium users get video access
      },
      unlimitedAI: {
        type: Boolean,
        default: false, // Only premium users get unlimited AI
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
subscriptionSchema.index({ subscriptionEndDate: 1 });

// Method to check if subscription is active
subscriptionSchema.methods.isSubscriptionActive = function () {
  return this.isActive && this.subscriptionEndDate > new Date();
};

// Method to check if user has premium features
subscriptionSchema.methods.hasPremiumAccess = function () {
  return this.subscriptionType === "premium" && this.isSubscriptionActive();
};

export const Subscription = mongoose.model("Subscription", subscriptionSchema);