import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../utils/axiosClient';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription status
  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/subscription/status');
      
      if (response.data.success) {
        setSubscription(response.data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      setError(error.response?.data?.message || 'Failed to fetch subscription');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check feature access
  const checkFeatureAccess = useCallback(async (feature, problemId = null) => {
    try {
      const params = { feature };
      if (problemId) params.problemId = problemId;
      
      const response = await axiosClient.get('/subscription/check-access', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to check feature access:', error);
      return {
        success: false,
        hasAccess: false,
        message: 'Failed to check access',
      };
    }
  }, []);

  // Check if user has premium access
  const hasPremiumAccess = useCallback(() => {
    return subscription?.subscriptionType === 'premium' && subscription?.isActive;
  }, [subscription]);

  // Check if user has video access
  const hasVideoAccess = useCallback(() => {
    return subscription?.features?.videoAccess && subscription?.isActive;
  }, [subscription]);

  // Check if user has unlimited AI access
  const hasUnlimitedAI = useCallback(() => {
    return subscription?.features?.unlimitedAI && subscription?.isActive;
  }, [subscription]);

  // Get remaining AI questions for a problem
  const getAIQuestionsRemaining = useCallback(() => {
    if (hasUnlimitedAI()) return -1; // Unlimited
    return subscription?.features?.aiQuestionsPerProblem || 2;
  }, [subscription, hasUnlimitedAI]);

  // Update subscription (called after successful upgrade)
  const updateSubscription = useCallback((newSubscription) => {
    setSubscription(newSubscription);
  }, []);

  // Initialize subscription data
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    loading,
    error,
    hasPremiumAccess,
    hasVideoAccess,
    hasUnlimitedAI,
    getAIQuestionsRemaining,
    checkFeatureAccess,
    updateSubscription,
    refetch: fetchSubscription,
  };
};