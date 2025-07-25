import { Crown, X, Zap, Video, MessageSquare } from "lucide-react";

const SubscriptionBanner = ({
  show,
  onClose,
  onUpgrade,
  message = "Upgrade to Premium for unlimited access",
  feature = "premium",
}) => {
  if (!show) return null;

  const getFeatureIcon = () => {
    switch (feature) {
      case "video":
        return <Video className="w-5 h-5 text-purple-400" />;
      case "ai":
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      default:
        return <Crown className="w-5 h-5 text-purple-400" />;
    }
  };

  const getFeatureMessage = () => {
    switch (feature) {
      case "video":
        return "Unlock video solutions with Premium subscription";
      case "ai":
        return "Get unlimited AI assistance with Premium";
      default:
        return message;
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getFeatureIcon()}
          <div>
            <h3 className="font-semibold text-white">{getFeatureMessage()}</h3>
            <p className="text-sm text-gray-400">
              Join thousands of developers who upgraded to Premium
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade Now</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
