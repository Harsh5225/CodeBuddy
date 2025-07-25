/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "../features/chatMessage/ChatSlice";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionBanner from "./SubscriptionBanner";
import SubscriptionModal from "./SubscriptionModal";

function ChatAi({ problem }) {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const { checkFeatureAccess, hasUnlimitedAI } = useSubscription();

  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(2);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const messagesEndRef = useRef(null);

  // Check AI access when component mounts
  useEffect(() => {
    const checkAccess = async () => {
      if (problem?._id) {
        const accessResult = await checkFeatureAccess('ai', problem._id);
        if (!accessResult.hasAccess) {
          setShowUpgradeBanner(true);
        }
      }
    };
    checkAccess();
  }, [problem, checkFeatureAccess]);

  const handleSubscriptionUpdate = (newSubscription) => {
    setShowUpgradeBanner(false);
    setShowSubscriptionModal(false);
    // Refresh the component or update state as needed
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const onSubmit = async (data) => {
    const userMessage = {
      role: "user",
      parts: [{ text: data.message }],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Check access before sending
    const accessResult = await checkFeatureAccess('ai', problem._id);
    if (!accessResult.hasAccess) {
      setShowUpgradeBanner(true);
      return;
    }

    dispatch(addMessage(userMessage));
    reset();
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: [...messages, userMessage].map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts[0].text }],
        })),
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
        problemId: problem._id,
      });

      const aiMessage = {
        role: "model",
        parts: [{ text: response.data.message }],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      dispatch(addMessage(aiMessage));
      
      // Update questions remaining
      if (response.data.subscription && response.data.subscription.questionsRemaining >= 0) {
        setQuestionsRemaining(response.data.subscription.questionsRemaining);
        if (response.data.subscription.questionsRemaining === 0) {
          setShowUpgradeBanner(true);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      
      // Check if it's a subscription limit error
      if (error.response?.status === 429) {
        setShowUpgradeBanner(true);
        return;
      }

      const errorMessage = {
        role: "model",
        parts: [{ text: "Something went wrong. Please try again later." }],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      dispatch(addMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
      {/* Subscription Banner */}
      <SubscriptionBanner
        show={showUpgradeBanner && !hasUnlimitedAI()}
        onClose={() => setShowUpgradeBanner(false)}
        onUpgrade={() => setShowSubscriptionModal(true)}
        feature="ai"
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscriptionUpdate={handleSubscriptionUpdate}
      />

      {/* Questions Remaining Indicator */}
      {!hasUnlimitedAI() && (
        <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/30 text-center">
          <p className="text-sm text-gray-400">
            {questionsRemaining > 0 
              ? `${questionsRemaining} AI questions remaining for this problem`
              : "AI question limit reached. Upgrade to Premium for unlimited access."
            }
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header mb-1 text-sm text-gray-500">
              {msg.role === "model" ? "AI" : "You"}
              <time className="text-xs opacity-50 ml-2">{msg.time}</time>
            </div>
            <div className="chat-bubble bg-base-200 text-base-content whitespace-pre-wrap break-words max-w-[90%] p-3 leading-snug">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words leading-snug">
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* AI typing bubble */}
        {isLoading && (
          <div className="chat chat-start">
            <div className="chat-header mb-1 text-sm text-gray-500">AI</div>
            <div className="chat-bubble bg-base-200 text-base-content animate-pulse max-w-[90%] p-3">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 p-4 bg-base-100 border-t"
      >
        <div className="flex items-center">
          <input
            placeholder={hasUnlimitedAI() ? "Ask me anything" : `Ask me anything (${questionsRemaining} remaining)`}
            className="input input-bordered flex-1"
            {...register("message", { required: true, minLength: 2 })}
            disabled={!hasUnlimitedAI() && questionsRemaining <= 0}
          />
          <button
            type="submit"
            className="btn btn-ghost ml-2"
            disabled={!!errors.message || isLoading || (!hasUnlimitedAI() && questionsRemaining <= 0)}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;

// !Problem:  AI Chat Messages Disappear on Page Navigation
// Description:
// When navigating away from the AI Chat page and returning, all previous messages are lost, even though the user expects to see the previous conversation.
// You send messages to the AI chat.

//  Solution: Use Redux Store for Persistent Chat State
// Move the message state from component-level (useState) to a global Redux store, which persists across route changes and component unmounts.

// steps taken
// Those messages are dispatched to the Redux store (e.g., via addMessage()).
// Even if you navigate away, Redux state is preserved (unless manually cleared).
// When you return to the AI chat, you read messages from Redux, not from useState.
