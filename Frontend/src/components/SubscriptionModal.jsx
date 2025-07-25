/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow-restricted-names */
import { useState, useEffect } from 'react';
import { usePhantomWallet } from '../hooks/usePhantomWallet';
import axiosClient from '../utils/axiosClient';
import {
  X,
  Crown,
  Check,
  Wallet,
  Zap,
  Video,
  MessageSquare,
  Star,
  Shield,
  Infinity,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose, onSubscriptionUpdate }) => {
  const {
    connected,
    connecting,
    publicKey,
    isPhantomInstalled,
    connect,
    disconnect: disconnectWallet,
    sendTransaction,
    getBalance,
  } = usePhantomWallet();

  const [loading, setLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const PREMIUM_PRICE = 0.1; // 0.1 SOL

  // Fetch current subscription status
  useEffect(() => {
    if (isOpen) {
      fetchSubscriptionStatus();
    }
  }, [isOpen]);

  // Update balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      updateBalance();
    }
  }, [connected, publicKey]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axiosClient.get('/subscription/status');
      if (response.data.success) {
        setCurrentSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const updateBalance = async () => {
    const walletBalance = await getBalance();
    setBalance(walletBalance);
  };

  const handleConnectWallet = async () => {
    setError('');
    const result = await connect();
    
    if (!result.success) {
      setError(result.error);
    } else {
      // Create or update subscription with wallet address
      try {
        await axiosClient.post('/subscription/create', {
          walletAddress: result.publicKey,
        });
        await fetchSubscriptionStatus();
      } catch (error) {
        console.error('Failed to create subscription:', error);
      }
    }
  };

  const handleUpgradeToPremium = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (balance < PREMIUM_PRICE) {
      setError(`Insufficient balance. You need at least ${PREMIUM_PRICE} SOL`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send transaction
      const transactionResult = await sendTransaction(PREMIUM_PRICE);
      
      if (!transactionResult.success) {
        throw new Error(transactionResult.error);
      }

      // Verify transaction and upgrade subscription
      const response = await axiosClient.post('/subscription/upgrade', {
        transactionSignature: transactionResult.signature,
        walletAddress: publicKey,
      });

      if (response.data.success) {
        setSuccess('Successfully upgraded to Premium! 🎉');
        setCurrentSubscription(response.data.subscription);
        
        // Notify parent component
        if (onSubscriptionUpdate) {
          onSubscriptionUpdate(response.data.subscription);
        }
        
        // Auto-close after success
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      setError(error.response?.data?.message || error.message || 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    if (!window.confirm('Are you sure you want to disconnect your wallet? Your premium access will be downgraded to free.')) {
      return;
    }

    setDisconnectLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Call backend to clear wallet info
      const response = await axiosClient.post('/subscription/disconnect');
      
      if (response.data.success) {
        // 2. Disconnect from Phantom wallet
        await disconnectWallet();
        
        // 3. Update local state
        setCurrentSubscription(response.data.subscription);
        setBalance(0);
        setSuccess('Wallet successfully disconnected');
        
        // 4. Notify parent component
        if (onSubscriptionUpdate) {
          onSubscriptionUpdate(response.data.subscription);
        }
      } else {
        throw new Error(response.data.message || 'Failed to disconnect wallet');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      setError(error.response?.data?.message || error.message || 'Disconnection failed');
    } finally {
      setDisconnectLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  const isPremium = currentSubscription?.subscriptionType === 'premium' && 
                   currentSubscription?.isActive;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  CodeBuddy Premium
                </h2>
                <p className="text-gray-400">Unlock unlimited coding potential</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Current Status */}
          {currentSubscription && (
            <div className={`mb-6 p-4 rounded-xl border ${
              isPremium 
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20' 
                : 'bg-gradient-to-r from-gray-500/10 to-gray-500/10 border-gray-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isPremium ? (
                    <Crown className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">
                      Current Plan: {currentSubscription.subscriptionType.charAt(0).toUpperCase() + currentSubscription.subscriptionType.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {isPremium 
                        ? `${currentSubscription.daysRemaining} days remaining`
                        : 'Limited features available'
                      }
                    </p>
                  </div>
                </div>
                {isPremium && (
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold">
                    Active
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* Wallet Connection */}
          {!connected ? (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-blue-400" />
                Connect Your Wallet
              </h3>
              
              {!isPhantomInstalled ? (
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 p-6 rounded-xl">
                  <div className="text-center">
                    <Wallet className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">Phantom Wallet Required</h4>
                    <p className="text-gray-300 mb-4">
                      You need to install Phantom wallet to make payments with Solana.
                    </p>
                    <button
                      onClick={() => window.open('https://phantom.app/', '_blank')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Install Phantom Wallet</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Connect Phantom Wallet</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Wallet Connected</h4>
                      <p className="text-sm text-gray-300 font-mono">
                        {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="font-bold text-white">{balance.toFixed(4)} SOL</p>
                  </div>
                </div>

                {/* Disconnect Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleDisconnectWallet}
                    disabled={disconnectLoading}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 flex items-center space-x-1"
                  >
                    {disconnectLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>Disconnect Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="text-3xl font-bold text-gray-300 mb-1">$0</div>
                <p className="text-gray-400 text-sm">Forever free</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">2 AI questions per problem</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <X className="w-4 h-4 text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">No video access</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">Basic problem solving</span>
                </li>
              </ul>
              
              <div className="text-center">
                <div className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg text-sm font-medium">
                  {currentSubscription?.subscriptionType === 'free' ? 'Current Plan' : 'Downgrade to Free'}
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xs font-bold">
                  POPULAR
                </div>
              </div>
              
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {PREMIUM_PRICE} SOL
                </div>
                <p className="text-gray-400 text-sm">One-time payment</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Infinity className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">Unlimited AI questions</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Video className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">Full video access</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Zap className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">Advanced features</span>
                </li>
              </ul>
              
              {isPremium ? (
                <div className="text-center">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>Active Premium</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUpgradeToPremium}
                  disabled={!connected || loading || balance < PREMIUM_PRICE}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Upgrade to Premium</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Features Comparison */}
          <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-blue-400" />
              What You Get with Premium
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-medium text-white">Unlimited AI Assistant</h4>
                  <p className="text-sm text-gray-400">Ask as many questions as you want</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Video className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-medium text-white">Video Solutions</h4>
                  <p className="text-sm text-gray-400">Access to all editorial videos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-medium text-white">Priority Support</h4>
                  <p className="text-sm text-gray-400">Get help when you need it</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-medium text-white">1 Year Access</h4>
                  <p className="text-sm text-gray-400">Full access for 365 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Secure payments powered by Solana blockchain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;