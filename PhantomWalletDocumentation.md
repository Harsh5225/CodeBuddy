# 🚀 Phantom Wallet Integration Guide for CodeBuddy

## 📋 Overview

This guide covers the complete integration of Phantom Wallet (Solana) with a subscription system for CodeBuddy. The implementation includes minimal subscription features that unlock premium content.

## 🎯 Subscription Features

### Free Tier
- ✅ **2 AI questions per problem** (daily limit)
- ✅ **Basic problem solving** access
- ❌ **No video access**
- ❌ **Limited AI assistance**

### Premium Tier (0.1 SOL)
- ✅ **Unlimited AI questions** for all problems
- ✅ **Full video access** to editorial solutions
- ✅ **Priority support**
- ✅ **1 year access**

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Solana        │
│                 │    │                 │    │   Blockchain    │
│ • Phantom Hook  │◄──►│ • Subscription  │◄──►│ • Transaction   │
│ • Subscription  │    │   Controller    │    │   Verification  │
│ • UI Components │    │ • Middleware    │    │ • Payment       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd Backend
npm install @solana/web3.js
```

**Frontend:**
```bash
cd Frontend
npm install @solana/web3.js
```

### 2. Environment Variables

**Backend (.env):**
```env
# Existing variables...

# Solana Configuration
SOLANA_NETWORK=devnet
PLATFORM_WALLET_ADDRESS=YOUR_SOLANA_WALLET_ADDRESS_HERE
```

**Frontend (.env):**
```env
# Existing variables...

# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_PLATFORM_WALLET=YOUR_SOLANA_WALLET_ADDRESS_HERE
```

### 3. Database Setup

The integration adds two new collections:

**Subscriptions Collection:**
```javascript
{
  userId: ObjectId,
  walletAddress: String,
  subscriptionType: "free" | "premium",
  transactionSignature: String,
  subscriptionEndDate: Date,
  features: {
    aiQuestionsPerProblem: Number,
    videoAccess: Boolean,
    unlimitedAI: Boolean
  }
}
```

**AI Usage Collection:**
```javascript
{
  userId: ObjectId,
  problemId: ObjectId,
  questionsAsked: Number,
  lastResetDate: Date
}
```

## 🎮 Usage Examples

### 1. Connect Phantom Wallet

```javascript
import { usePhantomWallet } from '../hooks/usePhantomWallet';

function MyComponent() {
  const { connect, connected, publicKey } = usePhantomWallet();
  
  const handleConnect = async () => {
    const result = await connect();
    if (result.success) {
      console.log('Connected:', result.publicKey);
    }
  };
  
  return (
    <button onClick={handleConnect}>
      {connected ? `Connected: ${publicKey}` : 'Connect Wallet'}
    </button>
  );
}
```

### 2. Check Subscription Status

```javascript
import { useSubscription } from '../hooks/useSubscription';

function FeatureComponent() {
  const { hasVideoAccess, hasUnlimitedAI, checkFeatureAccess } = useSubscription();
  
  const handleVideoClick = async () => {
    if (!hasVideoAccess()) {
      // Show upgrade modal
      setShowUpgradeModal(true);
      return;
    }
    // Play video
  };
  
  return (
    <div>
      {hasVideoAccess() ? (
        <VideoPlayer />
      ) : (
        <UpgradePrompt feature="video" />
      )}
    </div>
  );
}
```

### 3. Upgrade to Premium

```javascript
const handleUpgrade = async () => {
  const result = await sendTransaction(0.1); // 0.1 SOL
  
  if (result.success) {
    // Verify on backend
    const response = await axiosClient.post('/subscription/upgrade', {
      transactionSignature: result.signature,
      walletAddress: publicKey,
    });
    
    if (response.data.success) {
      // Update UI
      updateSubscription(response.data.subscription);
    }
  }
};
```

## 🔒 Security Implementation

### 1. Transaction Verification

```javascript
// Backend verification
const transaction = await connection.getTransaction(signature);
const lamports = transaction.meta?.postBalances[1] - transaction.meta?.preBalances[1];
const solAmount = Math.abs(lamports) / 1000000000;

if (solAmount < PREMIUM_PRICE_SOL) {
  throw new Error('Insufficient payment');
}
```

### 2. Middleware Protection

```javascript
// Protect premium features
app.use('/video/watch', checkVideoAccess);
app.use('/ai/chat', checkAIAccess);
```

### 3. Frontend Access Control

```javascript
// Component-level protection
{hasVideoAccess() ? (
  <VideoPlayer />
) : (
  <UpgradePrompt />
)}
```

## 📱 UI Components

### 1. Subscription Modal
- **Wallet connection** interface
- **Plan comparison** (Free vs Premium)
- **Payment processing** with Phantom
- **Success/error handling**

### 2. Subscription Banner
- **Feature-specific** upgrade prompts
- **Contextual messaging** for different features
- **Call-to-action** buttons

### 3. Usage Indicators
- **AI questions remaining** counter
- **Video access** status
- **Subscription expiry** warnings

## 🧪 Testing Strategy

### 1. Wallet Integration Testing

```javascript
// Test wallet connection
describe('Phantom Wallet', () => {
  test('should connect to wallet', async () => {
    const result = await connect();
    expect(result.success).toBe(true);
    expect(result.publicKey).toBeDefined();
  });
});
```

### 2. Subscription Flow Testing

```javascript
// Test subscription upgrade
describe('Subscription Upgrade', () => {
  test('should upgrade to premium', async () => {
    const transaction = await sendTransaction(0.1);
    expect(transaction.success).toBe(true);
    
    const upgrade = await upgradeToPremium(transaction.signature);
    expect(upgrade.subscriptionType).toBe('premium');
  });
});
```

### 3. Feature Access Testing

```javascript
// Test feature restrictions
describe('Feature Access', () => {
  test('should restrict video access for free users', async () => {
    const access = await checkFeatureAccess('video');
    expect(access.hasAccess).toBe(false);
  });
});
```

## 🚀 Deployment Considerations

### 1. Solana Network Configuration

**Development:**
```javascript
const connection = new Connection(clusterApiUrl('devnet'));
```

**Production:**
```javascript
const connection = new Connection(clusterApiUrl('mainnet-beta'));
```

### 2. Wallet Address Setup

1. **Create Solana wallet** for your platform
2. **Update environment variables** with your wallet address
3. **Test transactions** on devnet before mainnet

### 3. Error Handling

```javascript
// Comprehensive error handling
try {
  const result = await sendTransaction(amount);
} catch (error) {
  if (error.code === 4001) {
    // User rejected transaction
  } else if (error.code === -32603) {
    // Insufficient funds
  } else {
    // Other errors
  }
}
```

## 📊 Monitoring & Analytics

### 1. Subscription Metrics

```javascript
// Track subscription conversions
const metrics = {
  totalUsers: await User.countDocuments(),
  premiumUsers: await Subscription.countDocuments({ subscriptionType: 'premium' }),
  conversionRate: (premiumUsers / totalUsers) * 100,
};
```

### 2. Feature Usage Tracking

```javascript
// Monitor feature usage
const aiUsage = await AIUsage.aggregate([
  { $group: { _id: '$userId', totalQuestions: { $sum: '$questionsAsked' } } }
]);
```

### 3. Revenue Tracking

```javascript
// Calculate revenue
const revenue = await Subscription.aggregate([
  { $match: { subscriptionType: 'premium' } },
  { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
]);
```

## 🔮 Future Enhancements

### 1. Advanced Subscription Tiers
- **Student discounts** with verification
- **Team subscriptions** for organizations
- **Annual vs monthly** pricing options

### 2. Additional Payment Methods
- **Credit card integration** with Stripe
- **Other cryptocurrencies** (ETH, BTC)
- **PayPal integration**

### 3. Enhanced Features
- **Exclusive problem sets** for premium users
- **Advanced analytics** and progress tracking
- **Priority customer support**

## 🆘 Troubleshooting

### Common Issues

1. **Phantom not detected:**
   ```javascript
   if (!window.solana?.isPhantom) {
     // Redirect to Phantom installation
   }
   ```

2. **Transaction failed:**
   ```javascript
   // Check network status and user balance
   const balance = await getBalance();
   if (balance < requiredAmount) {
     // Show insufficient funds error
   }
   ```

3. **Subscription not updating:**
   ```javascript
   // Verify transaction on blockchain
   const transaction = await connection.getTransaction(signature);
   if (!transaction) {
     // Transaction not found or not confirmed
   }
   ```

### Debug Tools

1. **Solana Explorer:** https://explorer.solana.com/
2. **Phantom Developer Tools:** Browser DevTools → Console
3. **Backend Logs:** Monitor subscription controller logs

### Support

For issues with the Phantom Wallet integration:

1. **Check Phantom documentation:** https://docs.phantom.app/
2. **Solana Web3.js docs:** https://solana-labs.github.io/solana-web3.js/
3. **Test on devnet first** before mainnet deployment

---
